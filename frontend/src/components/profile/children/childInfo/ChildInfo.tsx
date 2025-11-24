import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
// import { Plus } from "lucide-react";
import { useChild } from "../../../../../hooks/useChild";
import { useAuth } from "@/context/auth";
import AddChildForm from "../addChild/AddChildForm";
import UpdateChildForm from "../updateChild/UpdateChild";
import ChildInfoCard from "./ChildInfoCard";
import type { Child } from "@/types/child";
import ChildCardsRail from "./ChildCardsRail";


const NO_CHILDREN: readonly Child[] = Object.freeze([] as const);
type Mode = "list" | "add";

export default function ChildrenInfoPage() {
    const { refetchUser } = useAuth();
    const { children, loading, refetch } = useChild(undefined);

    const [mode, setMode] = useState<Mode>("list");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [pendingId, setPendingId] = useState<string | null>(null);
    const [editingChildId, setEditingChildId] = useState<string | null>(null);

    const formAnchorRef = useRef<HTMLDivElement | null>(null);
    const items = useMemo(() => children ?? NO_CHILDREN, [children]);

    useEffect(() => {
        if (!items.length) return;
        if (pendingId && items.some((c) => c.id === pendingId)) {
            setSelectedId(pendingId);
            setPendingId(null);
            return;
        }
        if (!selectedId || !items.some((c) => c.id === selectedId)) {
            setSelectedId(items[0].id);
        }
    }, [items, pendingId, selectedId]);

    useEffect(() => {
        if (mode === "add") {
            requestAnimationFrame(() => {
                formAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        }
    }, [mode]);

    const selectedIndex = useMemo(() => {
        if (!selectedId) return 0;
        const i = items.findIndex((c) => c.id === selectedId);
        return i >= 0 ? i : 0;
    }, [items, selectedId]);

    const visibleChild = items.length ? items[selectedIndex] : null;

    const handleNext = () => {
        if (!items.length) return;
        const next = (selectedIndex + 1) % items.length;
        setSelectedId(items[next].id);
    };

    const handlePrev = () => {
        if (!items.length) return;
        const prev = (selectedIndex - 1 + items.length) % items.length;
        setSelectedId(items[prev].id);
    };

    const handleFormSuccess = (createdChild?: Child) => {
        setMode("list");
        if (createdChild) {
            setSelectedId(createdChild.id);
            setPendingId(createdChild.id);
        }
        refetch();
        refetchUser();
    };

    const handleDeleted = async (deletedId: string) => {
        const i = items.findIndex((c) => c.id === deletedId);
        if (i >= 0) {
            const nextIdx = items.length > 1 ? (i === items.length - 1 ? i - 1 : i + 1) : -1;
            setSelectedId(nextIdx >= 0 ? items[nextIdx].id : null);
        }
        refetch();
        refetchUser();
    };

    if (loading && !items.length) {
        return (
            <div className="flex justify-center items-center min-h-[240px] text-wonderforest/70">
                Loading children…
            </div>
        );
    }

    const handleEdit = (id: string) => {
        setSelectedId(id);
        setEditingChildId(id);
        requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    };


    return (
        <div className="mx-auto w-full max-w-7xl px-0 lg:px-8 py-0 sm:py-4">
            {/* Header */}
            <div className="mb-3 sm:mb-2 md:mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 ml-2 sm:ml-4 md:ml-14 lg:ml-16">
                <h1
                className="
                text-xl sm:text-2xl md:text-3xl lg:text-4xl
                font-bold lg:font-extrabold
                leading-tight tracking-normal md:tracking-tight
                text-wondergreen/95
                "
                >
                    Your Children&apos;s Information
                </h1>

                {mode === "list" ? (
                    <button
                    type="button"
                    onClick={() => setMode("add")}
                    className="
                        inline-flex items-center justify-center
                        rounded-lg bg-wondersun text-wonderforest
                        shadow ring-1 ring-black/5 hover:shadow-md transition
                        w-fit self-start                
                        mt-2 md:mt-0
                        px-2 py-1.5 text-sm
                        md:px-4 md:py-2 md:text-sm
                        lg:px-5 lg:py-2.5 lg:text-base sm:mr-8 md:mr-16
                    "
                    >
                    <span className="text-base sm:text-lg leading-none mr-1">＋</span>
                        Add a child
                    </button>
                ) : (
                    <button
                    type="button"
                    onClick={() => setMode("list")}
                    className="
                    inline-flex items-center justify-center
                    rounded-lg bg-wondersun text-wonderforest
                    shadow ring-1 ring-black/5 hover:shadow-md transition
                    w-fit self-start px-3 py-1.5 text-sm
                    sm:w-auto sm:px-2.5 sm:py-1.5 sm:text-base
                    md:px-4 md:py-2 md:text-sm
                    lg:px-5 lg:py-2.5 lg:text-base
                    "
                    >
                        ← Back to list
                    </button>
                )}
                </div>

                <div className="h-1 mt-3 rounded-full bg-gradient-to-r from-wondersun to-wonderorange w-28 sm:w-28 md:w-36 lg:w-40 ml-2 sm:ml-6 md:ml-14 lg:ml-16" />
            </div>

            {/* Content */}
            {mode === "add" ? (
                <div
                ref={formAnchorRef}
                className="mt-6 sm:mt-8 bg-white rounded-2xl ring-1 ring-black/5 shadow-sm p-4 sm:p-6"
                >
                    <AddChildForm showForm={true} onSuccess={handleFormSuccess} />
                </div>
            ) : (
                <>
                {items.length > 0 && (
                    <>
                        {/* 1) Mobile */}
                        <div className="md:hidden mt-4">
                        {editingChildId
                            ? (() => {
                                const curr = items.find(c => c.id === editingChildId);
                                if (!curr) return null;
                                return (
                                <div className="bg-white rounded-2xl ring-1 ring-black/5 shadow-sm overflow-hidden">
                                    <div className="h-1 w-full bg-gradient-to-r from-wondersun via-wonderorange to-wondergreen" />
                                    <div className="p-4 sm:p-5">
                                    <UpdateChildForm
                                        setEditingChildId={setEditingChildId}
                                        currChild={curr}
                                        onPatched={(id: string) => setPendingId(id)}
                                        refetchChildren={refetch}
                                    />
                                    </div>
                                </div>
                                );
                            })()
                            : (
                            <ChildCardsRail
                                items={items}
                                onEdit={handleEdit}
                                onDeleted={handleDeleted}
                            />
                            )
                        }
                        </div>


                        {/* 2) Tablet/Desktop: Your current block with arrows and one card */}
                        {visibleChild && (
                        <div className="hidden md:flex flex-row gap-3 sm:gap-4 md:gap-6 my-6 sm:my-8 items-stretch">
                            {items.length > 1 && (
                            <FaCircleChevronLeft
                                className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] cursor-pointer my-auto text-wonderforest/70 hover:text-wonderforest transition-colors"
                                onClick={!editingChildId ? handlePrev : undefined}
                            />
                            )}

                            <div className="basis-full max-w-5xl w-full mx-auto" key={visibleChild.id}>
                            {editingChildId === visibleChild.id ? (
                                <UpdateChildForm
                                setEditingChildId={setEditingChildId}
                                currChild={visibleChild}
                                onPatched={(id: string) => setPendingId(id)}
                                refetchChildren={refetch}
                                />
                            ) : (
                                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 hover:shadow-md transition-all overflow-hidden">
                                <div className="h-1 w-full bg-gradient-to-r from-wondersun via-wonderorange to-wondergreen" />
                                <div className="p-4 sm:p-5 md:p-6">
                                    <ChildInfoCard
                                    child={visibleChild}
                                    onEdit={() => setEditingChildId(visibleChild.id)}
                                    onDeleted={handleDeleted}
                                    />
                                </div>
                                </div>
                            )}
                            </div>

                            {items.length > 1 && (
                            <FaCircleChevronRight
                                className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] cursor-pointer my-auto text-wonderforest/70 hover:text-wonderforest transition-colors"
                                onClick={!editingChildId ? handleNext : undefined}
                            />
                            )}
                        </div>
                        )}
                    </>
                )}



                {/* FAB only for mobile */}
                {/* <button
                    onClick={() => setMode("add")}
                    className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-2 rounded-full bg-wondergreen px-5 py-3 text-white shadow-lg sm:hidden"
                    aria-label="Add a child"
                >
                    <Plus className="h-5 w-5" /> Add
                </button> */}
                </>
            )}
        </div>
    );
}
