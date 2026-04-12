"use client";

import { use, useEffect } from "react";
import { useModal } from "@/context/modal";
import ResetPasswordModal from "@/components/login/ResetPasswordModal";

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const { setModalContent } = useModal();

  useEffect(() => {
    setModalContent(<ResetPasswordModal token={token} />);
  }, [token, setModalContent]);

  return null;
}
