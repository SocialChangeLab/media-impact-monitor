import seed from "seed-random";

export const seededRandom = seed("dslkfja;lfewiop;j");
export const randomUntil = (max: number, seeded = true) =>
	Math.ceil((seeded ? seededRandom() : Math.random()) * max);
export const randomInRange = (max: number, min = 0, seeded = true) =>
	Math.floor((seeded ? seededRandom() : Math.random()) * (max - min + 1)) + min;
export const arrayOfRandomLengthInRange = (
	maxLength: number,
	minLength = 1,
	seeded = true,
) =>
	new Array(randomInRange(maxLength, minLength, seeded))
		.fill(null)
		.map((_, idx) => idx);
