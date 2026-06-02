"""
One-time migration: seed the ImpactStat singleton from existing approved
events and programs.

Run from the backend directory:
    python -m migrations.seed_impact_stat                  # development (.env)
    python -m migrations.seed_impact_stat --env staging    # staging     (.env.staging)
    python -m migrations.seed_impact_stat --env production # production  (.env.production)
"""

import argparse
import asyncio
from pathlib import Path

from dotenv import load_dotenv
from prisma import Prisma


def load_env(env: str) -> None:
    env_file = Path(__file__).resolve().parents[1] / (
        ".env" if env == "development" else f".env.{env}"
    )
    if not env_file.exists():
        raise FileNotFoundError(f"Env file not found: {env_file}")
    load_dotenv(env_file, override=True)
    print(f"Loaded environment from {env_file.name}")


async def main(env: str) -> None:
    load_env(env)

    db = Prisma()
    await db.connect()

    try:
        event_count = await db.events.count(where={"status": "approved"})
        program_count = await db.enrichmentprograms.count(where={"status": "approved"})

        existing = await db.impactstat.find_first()

        if existing:
            updated = await db.impactstat.update(
                where={"id": existing.id},
                data={
                    "totalEventsCreated": event_count,
                    "totalProgramsCreated": program_count,
                },
            )
            print(f"Updated ImpactStat {updated.id}: "
                  f"events={updated.totalEventsCreated}, "
                  f"programs={updated.totalProgramsCreated}")
        else:
            created = await db.impactstat.create(
                data={
                    "totalEventsCreated": event_count,
                    "totalProgramsCreated": program_count,
                }
            )
            print(f"Created ImpactStat {created.id}: "
                  f"events={created.totalEventsCreated}, "
                  f"programs={created.totalProgramsCreated}")

    finally:
        await db.disconnect()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed ImpactStat from existing records.")
    parser.add_argument(
        "--env",
        default="development",
        choices=["development", "staging", "production"],
        help="Environment to target (default: development)",
    )
    args = parser.parse_args()
    asyncio.run(main(args.env))
