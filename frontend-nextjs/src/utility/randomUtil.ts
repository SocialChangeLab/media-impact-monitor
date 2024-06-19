import seed from "seed-random";

export const seededRandom = (seedString = "abcdefg") => seed(seedString)();
export const randomUntil = (max: number, seedString = "abcdefg") =>
	Math.ceil(seededRandom(seedString) * max);
export const randomInRange = (max: number, min = 0, seedString = "abcdefg") =>
	Math.floor(seededRandom(seedString) * (max - min + 1)) + min;
export const arrayOfRandomLengthInRange = (maxLength: number, minLength = 1) =>
	new Array(randomInRange(maxLength, minLength))
		.fill(null)
		.map((_, idx) => idx);
