"use client";

import { cn } from "@/utility/classNames";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { type FormEvent, useState } from "react";
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
	const [email, setEmail] = useState<string>("");
	const [status, setStatus] = useState<
		"success" | "error" | "loading" | "idle"
	>("idle");
	const [responseMsg, setResponseMsg] = useState<string>("");

	async function handleSubscribe(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setStatus("loading");
		try {
			const { message, error } = await subscribeToNewsletter(email);

			if (error) {
				setStatus("error");
				setResponseMsg(error);
			} else if (message) {
				setStatus("success");
				setEmail("");
				setResponseMsg(message);
			}
		} catch (err) {
			if (err instanceof Error) {
				setStatus("error");
				setResponseMsg(err.message);
			}
		}
	}

	return (
		<form
			onSubmit={handleSubscribe}
			className={cn("flex flex-col gap-1", classNames.form)}
		>
			<div className="grid grid-cols-[1fr_auto] items-end">
				<div className="flex flex-col gap-2 grow">
					<label htmlFor="newsletter-email" className="text-sm">
						What is your email address?
					</label>
					<input
						className={cn(
							`grow transition focusable items-center`,
							`caret-fg disabled:border-grayMed border text-fg`,
							status === "error" && "border-[var(--sentiment-negative)]",
							status === "success" && "border-[var(--sentiment-positive)]",
							classNames.input,
						)}
						id="newsletter-email"
						type="email"
						placeholder="anna.smith@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={status === "loading"}
					/>
				</div>
				<Button
					disabled={status === "loading"}
					className={cn(classNames.button)}
				>
					Subscribe
				</Button>
			</div>
			<div className="relative h-px">
				<AnimatePresence>
					{responseMsg && (
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
