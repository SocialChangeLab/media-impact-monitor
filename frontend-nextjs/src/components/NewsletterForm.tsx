"use client";

import { cn } from "@/utility/classNames";
import { texts } from "@/utility/textUtil";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { type FormEvent, useCallback, useState } from "react";
import { z } from "zod";
import { subscribeToNewsletter } from "./NewsletterForm.action";
import { Button } from "./ui/button";

export const NewsletterForm = ({
	classNames = {},
}: {
	classNames?: {
		form?: string;
		input?: string;
		button?: string;
		message?: string;
	};
}) => {
	const [status, setStatus] = useState<
		"success" | "error" | "loading" | "idle"
	>("idle");
	const [responseMsg, setResponseMsg] = useState<string>("");

	const handleSubscribe = useCallback(async (e: FormEvent<HTMLFormElement>) => {
		const form = e.currentTarget;
		const formData = new FormData(form);
		e.preventDefault();
		setStatus("loading");

		const emailAddressValidation = z
			.string()
			.email()
			.safeParse(formData.get("email"));
		if (!emailAddressValidation.success) {
			setStatus("error");
			setResponseMsg(texts.newsLetterSection.invalidEmail);
			return;
		}
		const emailAddress = emailAddressValidation.data;
		try {
			const { message, error } = await subscribeToNewsletter(emailAddress);

			if (error) {
				setStatus("error");
				setResponseMsg(error);
			} else if (message) {
				setStatus("success");
				setResponseMsg("");
				setResponseMsg(message);
			}
		} catch (err) {
			if (err instanceof Error) {
				setStatus("error");
				setResponseMsg(err.message);
			}
		}
	}, []);

	return (
		<form
			onSubmit={handleSubscribe}
			className={cn("flex flex-col gap-1", classNames.form)}
		>
			<div className="grid grid-cols-[1fr_auto] items-end">
				<div className="flex flex-col gap-2 grow">
					<label htmlFor="newsletter-email" className="text-sm">
						{texts.newsLetterSection.inputLabel}
					</label>
					<input
						className={cn(
							`grow transition focusable items-center`,
							`caret-fg disabled:border-grayMed border text-fg`,
							status === "error" && "border-[var(--sentiment-negative)]",
							status === "success" && "border-[var(--sentiment-positive)]",
							status === "loading" && "text-grayMed",
							classNames.input,
						)}
						id="newsletter-email"
						name="email"
						type="email"
						required
						placeholder={texts.newsLetterSection.inputPlaceholder}
						disabled={status === "loading"}
					/>
				</div>
				<Button
					disabled={status === "loading"}
					className={cn(classNames.button)}
					type="submit"
				>
					{texts.newsLetterSection.submitButton}
				</Button>
			</div>
			<div className="relative h-px">
				<AnimatePresence>
					{responseMsg && ["success", "error"].includes(status) && (
						<motion.div
							initial={{ opacity: 0, y: -5 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 5 }}
							transition={{ duration: 0.3 }}
							className={cn(
								"absolute top-0 left-0 w-full h-fit",
								"flex justify-between px-2 py-1 items-center border relative gap-4",
								status === "success" && "border-[var(--sentiment-positive)]",
								status === "error" && "border-[var(--sentiment-negative)]",
								classNames.message,
							)}
						>
							<div
								className={cn(
									"absolute inset-0 opacity-50",
									status === "success" && "bg-[var(--sentiment-positive)]",
									status === "error" && "bg-[var(--sentiment-negative)]",
								)}
								aria-hidden="true"
							/>
							<span className="text-brandWhite relative leading-tight text-sm">
								{responseMsg}
							</span>
							{status === "success" && <Check className="relative shrink-0" />}
							{status === "error" && <X className="relative shrink-0" />}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</form>
	);
};
