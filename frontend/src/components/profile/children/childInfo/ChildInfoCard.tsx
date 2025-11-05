import React from "react";
import OpenModalButton from "@/context/openModalButton";
import DeleteChild from "../DeleteChild";
import type { Child } from "@/types/child";
import { FaCheck, FaPen, FaTrash } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { numericFormatDate, formatDateTimeLocal } from "../../../../../utils/formatDate";
import { calculateAge } from "../../../../../utils/calculateAge";
import { displayGrade } from "../../../../../utils/displayGrade";

type Props = {
  child: Child;
  onEdit: () => void;
  onDeleted: (deletedId: string) => void;
};

export default function ChildInfoCard({ child, onEdit, onDeleted }: Props) {
  const age = child.birthday ? calculateAge(child.birthday) : null;

  return (
    <article className="bg-white rounded-2xl ring-1 ring-black/5 shadow-sm p-4 sm:p-4 md:p-6 lg:p-6">
      {/* Header */}
      <header className="flex items-start justify-between gap-2 sm:gap-2 mb-3 sm:mb-5">
        <h2 className="text-base sm:text-xl font-semibold text-wondergreen leading-snug break-words line-clamp-2 mt-2">
          {child.firstName}{" "}
          {child?.preferredName ? (
            <span className="text-wonderforest/70">&quot;{child.preferredName}&quot; </span>
          ) : null}
          {child.lastName}
        </h2>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3 mt-1">
          {/* EDIT  */}
          <button
            type="button"
            aria-label="Edit child"
            onClick={onEdit}
            className="inline-flex h-6 w-6 sm:h-8 sm:w-8 sm:h-8 sm:w-8 md:h-9 md:w-9 items-center justify-center rounded-full
                       bg-wonderleaf text-white shadow-sm
                       hover:bg-wondergreen active:scale-[0.98]
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-wondergreen/40
                       transition touch-manipulation"
          >
            <FaPen className="h-3 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" />
          </button>

          {/* DELETE  */}
          <OpenModalButton
            buttonText={
              <span
                aria-label="Delete child"
                className="inline-flex h-6 w-6 sm:h-8 sm:w-8 md:h-9 md:w-9 items-center justify-center rounded-full
                           bg-wonderorange text-white shadow-sm
                           hover:bg-red-500 active:scale-[0.98]
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300
                           transition touch-manipulation"
              >
                <FaTrash className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" />
              </span>
            }
            modalComponent={<DeleteChild currChild={child} onDeleted={onDeleted} />}
          />
        </div>
      </header>

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 md:gap-y-6 md:gap-x-6">
        {/* Birthday */}
        <Section title="BIRTHDAY">
          <Field>
            {child.birthday ? (
              <>
                {numericFormatDate(child.birthday)}{" "}
                <span className="text-wonderforest/60">
                  ({age} {age === 1 ? "year" : "years"} old)
                </span>
              </>
            ) : (
              "—"
            )}
          </Field>
        </Section>

        {/* Grade */}
        <Section title="GRADE">
          <Field>{child.grade ? displayGrade(child.grade) : "N/A"}</Field>
        </Section>

        {/* Photo Consent */}
        <Section title="PHOTO CONSENT" className="md:col-span-2">
          <div className="flex flex-wrap items-center gap-2 text-sm text-wonderforest/80">
            {child.photoConsent ? (
              <>
                <Badge className="bg-green-100 text-green-700">
                  <FaCheck className="h-3 w-3" />
                  <span>Allowed</span>
                </Badge>
                <span className="ml-1">
                  v{child.photoConsentVer ?? "—"}
                  {child.photoConsentAt && <> · signed {formatDateTimeLocal(child.photoConsentAt)}</>}
                </span>
              </>
            ) : (
              <Badge className="bg-red-100 text-red-700">
                <FaX className="h-3 w-3" />
                <span>Not allowed</span>
              </Badge>
            )}
          </div>
        </Section>

        {/* Emergency Contacts */}
        <Section title="EMERGENCY CONTACTS" withDivider className="md:col-span-2">
          {child?.emergencyContacts?.length ? (
            <dl className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              {child.emergencyContacts.map((ec) => (
                <div
                  key={ec.id}
                  className="rounded-lg bg-wonderleaf/5 p-3 ring-1 ring-transparent hover:ring-black/5 transition"
                >
                  <div className="text-sm">
                    <span className="font-medium text-wonderforest">Contact:</span>{" "}
                    {ec.firstName} {ec.lastName}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-wonderforest">Relationship:</span> {ec.relationship}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-wonderforest">Phone:</span>{" "}
                    {ec.phoneNumber ? (
                      <a
                        href={`tel:${ec.phoneNumber}`}
                        className="underline underline-offset-2 decoration-wonderleaf/50 hover:decoration-wonderleaf focus:outline-none focus-visible:ring-2 focus-visible:ring-wondergreen/40 rounded-sm"
                      >
                        {ec.phoneNumber}
                      </a>
                    ) : (
                      "—"
                    )}
                  </div>
                </div>
              ))}
            </dl>
          ) : (
            <Field>—</Field>
          )}
        </Section>

        {/* Medical */}
        <Section title="MEDICAL ACCOMMODATIONS" withDivider className="md:col-span-2">
          <Field>
            {child.allergiesMedical?.trim()
              ? child.allergiesMedical
              : "List allergies/medical accommodations (N/A if none)"}
          </Field>
        </Section>

        {/* Notes */}
        <Section title="ADDITIONAL NOTES" withDivider className="md:col-span-2">
          <Field>
            {child.notes?.trim()
              ? child.notes
              : "Optional: Please note any information that would be beneficial for instructor"}
          </Field>
        </Section>
      </div>
    </article>
  );
}

/* ===== helpers ===== */

function Section({
  title,
  children,
  withDivider = false,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  withDivider?: boolean;
  className?: string;
}) {
  return (
    <section className={`${withDivider ? "pt-4 border-t border-black/5" : ""} ${className}`}>
      <h3 className="text-xs font-semibold tracking-wide text-wonderforest/70">{title}</h3>
      <div className="mt-1.5">{children}</div>
    </section>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-wonderforest/80 ml-1.5 break-words whitespace-pre-wrap">
      {children}
    </p>
  );
}

function Badge({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
