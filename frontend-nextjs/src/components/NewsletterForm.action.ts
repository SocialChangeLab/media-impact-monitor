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
	const MAILCHIMP_REGION = process.env.MAILCHIMP_REGION;
	const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

	const url = `https://${MAILCHIMP_REGION}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;
	console.log("Now sending request to", url, email);

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
		} else {
			console.error(`${error}`);
		}

		return {
			error:
				"Oops! There was an error subscribing you to the newsletter. Please try with another email address.",
		};
	}

	return {};
};
