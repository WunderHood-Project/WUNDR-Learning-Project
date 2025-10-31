type Props = {
  hasEvents: boolean;
  viewMode: "cards" | "calendar";
  onChangeView: (m: "cards" | "calendar") => void;
};

export default function Header({ hasEvents, viewMode, onChangeView }: Props) {
    const title =
    viewMode === "calendar"
    ? "Your Calendar"
    : hasEvents
    ? "Enrolled Events"
    : "No Enrollments Yet";

    return (
        <div className="mb-4">
            {/* Title and segmented control on one line (wrap on small screens) */}
            <div className="flex items-center justify-between gap-3 flex-wrap ml-2 md:ml-14">
                <h1
                className="
                    text-2xl sm:text-2xl md:text-4xl
                    font-bold md:font-extrabold
                    leading-tight
                    tracking-normal md:tracking-tight
                    text-wondergreen/95  
                "
                >
                {title}
                </h1>

                {/* Segmented control next to the title */}
                <div
                className="
                    inline-flex shrink-0 items-center
                    rounded-2xl bg-white/80 p-1
                    shadow-sm ring-1 ring-wondergreen/15
                    lg:mr-20 md:mr-16 sm:mr-2
                "
                >
                <button
                    type="button"
                    onClick={() => onChangeView("cards")}
                    aria-pressed={viewMode === "cards"}
                    className={`
                    px-2 sm:px-2 md:px-4 py-1 sm:py-2
                    rounded-xl
                    text-[12px] sm:text-[12px] md:text-sm font-medium
                    transition
                    ${viewMode === "cards"
                        ? "bg-wondergreen text-white shadow"
                        : "text-wondergreen hover:bg-wonderleaf/10"}
                    `}
                >
                    Enrolled
                </button>
                <button
                    type="button"
                    onClick={() => onChangeView("calendar")}
                    aria-pressed={viewMode === "calendar"}
                    className={`
                    px-2 sm:px-2 md:px-4 py-1 sm:py-2
                    rounded-xl
                    text-[12px] sm:text-[12px] md:text-sm font-medium
                    transition
                    ${viewMode === "calendar"
                        ? "bg-wondergreen text-white shadow"
                        : "text-wondergreen hover:bg-wonderleaf/10"}
                    `}
                >
                    Calendar
                </button>
            </div>
        </div>
        {/* Thin accent line under the title */}
        <div className="h-1 mt-3 rounded-full bg-gradient-to-r from-wondersun to-wonderorange w-24 sm:w-28 md:w-36 ml-2 md:ml-14" />
        </div>
    );
}
