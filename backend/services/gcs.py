import os
from datetime import timedelta
from google.cloud import storage

# Module-level cached client:
# Create one Storage client per process (cheaper + avoids repeated auth/HTTP setup).
_gcs_client = None


def _client() -> storage.Client:
    """
    Returns a cached Google Cloud Storage client.
    Uses Application Default Credentials (ADC) configured via environment
    (commonly GOOGLE_APPLICATION_CREDENTIALS in local/dev).
    """
    global _gcs_client
    if _gcs_client is None:
        _gcs_client = storage.Client()
    return _gcs_client


def get_bucket():
    """
    Returns the configured GCS bucket instance.
    IMPORTANT: Bucket must remain private. Access is provided via signed URLs only.
    """
    # Support multiple env var names (useful across local/dev/prod configs).

    bucket_name = os.getenv("GCS_BUCKET") or os.getenv("GCS_BUCKET_NAME") or "wonderhood-waiver-pdfs"
    return _client().bucket(bucket_name)


def upload_bytes(data: bytes, object_name: str, content_type: str = "application/pdf") -> str:
    """
    Uploads raw bytes to GCS as a single object.
    Returns the stable gs:// URI (store this or object_name in DB, not the signed URL).
    """
    bucket = get_bucket()
    blob = bucket.blob(object_name)
    blob.upload_from_string(data, content_type=content_type)
    return f"gs://{bucket.name}/{object_name}"


def download_bytes(object_name: str) -> bytes:
    """
    Downloads an object from GCS as bytes.
    Typically used for internal/admin flows (most users should download via signed URLs).
    """
    bucket = get_bucket()
    blob = bucket.blob(object_name)
    return blob.download_as_bytes()


def generate_signed_download_url(object_name: str, expires_seconds: int | None = None) -> str:
    """
    Generates a temporary download link for a private object (Signed URL v4).
    Use this for user downloads/printing. Do NOT make the bucket public.

    TTL (seconds) is configurable via GCS_SIGNED_URL_TTL_SECONDS (default: 3600).
    """
    if expires_seconds is None:
        expires_seconds = int(os.getenv("GCS_SIGNED_URL_TTL_SECONDS", "3600"))

    bucket = get_bucket()
    blob = bucket.blob(object_name)

    # Use the last path segment as a friendly filename for the browser download prompt.
    filename = os.path.basename(object_name)
    return blob.generate_signed_url(
        version="v4",
        expiration=timedelta(seconds=expires_seconds),
        method="GET",
        # Force download with a nice filename (instead of random object path).
        response_disposition=f'attachment; filename="{filename}"',
    )

def upload_pdf_to_gcs(object_name: str, pdf_bytes: bytes) -> str:
    """
    Small convenience wrapper for PDF uploads.
    Keeps router/service code clean: (object_name, bytes) -> gs:// URI.
    """
    return upload_bytes(pdf_bytes, object_name, content_type="application/pdf")

