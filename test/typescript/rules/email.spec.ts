/// <reference path="../../../index.d.ts" /> // here we make a reference to exists module definition
import ValidatorType, {RuleEmail, RuleURL} from 'fastest-validator'; // here we importing type definition of default export

const Validator: typeof ValidatorType = require('../../../index'); // here we importing real Validator Constructor
const v: ValidatorType = new Validator();

describe("Test rule: email", () => {
	it("should check empty values", () => {
		const check = v.compile({ $$root: true, type: "email", empty: false } as RuleEmail);

		expect(check("john.doe@company.net")).toEqual(true);
		expect(check("")).toEqual([{ type: "emailEmpty", actual: "", message: "The '' field must not be empty." }]);
	});

	it("should check values", () => {
		const check = v.compile({ $$root: true, type: "email" } as RuleEmail);
		const message = "The '' field must be a string.";

		expect(check(0)).toEqual([{ type: "string", actual: 0, message }]);
		expect(check(1)).toEqual([{ type: "string", actual: 1, message }]);
		expect(check("")).toEqual(true);
		expect(check("true")).toEqual([{ type: "email", actual: "true", message: "The '' field must be a valid e-mail." }]);
		expect(check([])).toEqual([{ type: "string", actual: [], message }]);
		expect(check({})).toEqual([{ type: "string", actual: {}, message }]);
		expect(check(false)).toEqual([{ type: "string", actual: false, message }]);
		expect(check(true)).toEqual([{ type: "string", actual: true, message }]);
	});

	it("should check values with quick pattern", () => {
		const check = v.compile({ $$root: true, type: "email" } as RuleEmail);
		const message = "The '' field must be a valid e-mail.";

		expect(check("abcdefg")).toEqual([{ type: "email", actual: "abcdefg", message }]);
		expect(check("1234")).toEqual([{ type: "email", actual: "1234", message }]);
		expect(check("abc@gmail")).toEqual([{ type: "email", actual: "abc@gmail", message }]);
		expect(check("@gmail.com")).toEqual([{ type: "email", actual: "@gmail.com", message }]);

		// Invalid but we are in quick mode
		expect(check("https://john@company.net")).toEqual(true);

		expect(check("john.doe@company.net")).toEqual(true);
		expect(check("james.123.45@mail.co.uk")).toEqual(true);
		expect(check("admin@nasa.space")).toEqual(true);
	});

	it("should check values", () => {
		const check = v.compile({ $$root: true, type: "email", mode: "precise" } as RuleEmail);
		const message = "The '' field must be a valid e-mail.";

		expect(check("abcdefg")).toEqual([{ type: "email", actual: "abcdefg", message }]);
		expect(check("1234")).toEqual([{ type: "email", actual: "1234", message }]);
		expect(check("abc@gmail")).toEqual([{ type: "email", actual: "abc@gmail", message }]);
		expect(check("@gmail.com")).toEqual([{ type: "email", actual: "@gmail.com", message }]);
		expect(check("https://john@company.net")).toEqual([{ type: "email", actual: "https://john@company.net", message }]);

		expect(check("john.doe@company.net")).toEqual(true);
		expect(check("james.123.45@mail.co.uk")).toEqual(true);
		expect(check("admin@nasa.space")).toEqual(true);
	});

	it("should not normalize", () => {
		const check = v.compile({ email: { type: "email" } as RuleEmail });

		const obj = { email: "John.Doe@Gmail.COM" };
		expect(check(obj)).toEqual(true);
		expect(obj).toEqual({
			email: "John.Doe@Gmail.COM"
		});
	});

	it("should normalize", () => {
		const check = v.compile({ email: { type: "email", normalize: true } as RuleEmail });

		const obj = { email: " John.Doe@Gmail.COM   " };
		expect(check(obj)).toEqual(true);
		expect(obj).toEqual({
			email: "john.doe@gmail.com"
		});
	});

});
