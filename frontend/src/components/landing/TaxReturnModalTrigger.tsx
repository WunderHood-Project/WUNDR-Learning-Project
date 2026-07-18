"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useModal } from "@/context/modal";
import TaxReturnSuccessModal from "@/components/TaxReturn/TaxReturnSuccessModal";

export default function TaxReturnModalTrigger() {
  const searchParams = useSearchParams();
  const modal = searchParams.get("modal");
  const { setModalContent } = useModal();

  useEffect(() => {
    if (modal === "taxReturnSuccess") {
      setModalContent(<TaxReturnSuccessModal />);
    }
  }, [modal, setModalContent]);

  return null;
}
