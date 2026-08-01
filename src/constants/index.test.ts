import {
	PROFILE,
	SUMMARY,
	SKILLS,
	EXPERIENCE,
	PROJECTS,
	EDUCATION,
	CERTIFICATIONS,
} from "./index";

test("profile has required contact fields", () => {
	expect(PROFILE.name).toBe("Piolo B. Valledor");
	expect(PROFILE.email).toBe("piolovalledor@gmail.com");
	expect(PROFILE.resumeUrl).toBe("#");
});

test("summary is non-empty", () => {
	expect(SUMMARY.length).toBeGreaterThan(0);
});

test("every skills group is non-empty", () => {
	Object.values(SKILLS).forEach((group) => {
		expect(group.length).toBeGreaterThan(0);
	});
});

test("experience has two roles", () => {
	expect(EXPERIENCE).toHaveLength(2);
});

test("projects include the portfolio site and the thesis project", () => {
	expect(PROJECTS).toHaveLength(2);
	expect(PROJECTS[0].title).toBe("Personal Portfolio Website");
	expect(PROJECTS[1].title).toContain("Bakasyunan Tanay Resort");
});

test("education and certifications are populated", () => {
	expect(EDUCATION.school).toBe("Pamantasan ng Lungsod ng Marikina");
	expect(CERTIFICATIONS).toHaveLength(2);
});
