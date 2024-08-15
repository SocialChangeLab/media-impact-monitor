"use server";
import { z } from "zod";

type Data = { message?: string; error?: string };

const EmailSchema = z
	.string()
	.email({ message: "Please enter a valid email address" });

export const subscribeToNewsletter = async (email: unknown): Promise<Data> => {
	const emailValidation = EmailSchema.safeParse(email);
	if (!emailValidation.success) {
		return { error: "Please enter a valid email address" };
	}

	const API_KEY = process.env.MAILCHIMP_API_KEY;
	const API_SERVER = process.env.MAILCHIMP_API_SERVER;
	const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

	const url = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

	try {
		const response = await fetch(url, {
			method: "POST",
			body: JSON.stringify({
				email_address: emailValidation.data,
				status: "subscribed",
			}),
			headers: {
				"Content-Type": "application/json",
				Authorization: `api_key ${API_KEY}`,
			},
		});
		if (response.status === 200) {
			return { message: "Awesome! You have successfully subscribed!" };
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error(`${error}`);

			if (error.message.includes("Member Exists")) {
				return { message: "Awesome! You have successfully subscribed!" };
			}
		}

		return {
			error:
				"Oops! There was an error subscribing you to the newsletter. Please email me at ogbonnakell@gmail.com and I'll add you to the list.",
		};
	}

	return {};
};
