import seed from "seed-random";

export const seededRandom = seed("abcdefghijklmnopqrstuvwxyz");
export const randomUntil = (max: number) => Math.ceil(seededRandom() * max);
export const randomInRange = (max: number, min = 0) =>
	Math.floor(seededRandom() * (max - min + 1)) + min;
export const arrayOfRandomLengthInRange = (maxLength: number, minLength = 1) =>
	new Array(randomInRange(maxLength, minLength))
		.fill(null)
		.map((_, idx) => idx);
