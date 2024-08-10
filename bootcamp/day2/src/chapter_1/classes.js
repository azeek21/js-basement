/*
У экземпляра класса должны присутствовать св-ва:
-name string.
-grade string Для простоты предположим, что система грейдов будет иметь значения от L1 до L4.
-hardSkills string[].
-company string.


Так же должны иметься три метода:

-changeCompany(newCompanyName) - сотрудник может сменить компанию, либо же просто уволиться.
-upGrade() - сотрудник может повысить квалификацию.
-addSkill(newSkillName) - сотрудник может дополнить список своих скиллов.
*/

export const GRADES = {
	L1: 'L1',
	L2: 'L2',
	L3: 'L3',
	L4: 'L4',
};

export function isGradeBiggerOrEqualTo(l, r) {
	return Number(l[1]) >= Number(r[1])
}

export class Employee {
	/** @type String */
	name;
	/** @type {keyof typeof GRADES} */
	grade = GRADES.L1;
	/** @type Array<String> */
	hardSkills;
	/** @type String */
	company;

	/** @constructor @param {String} name @param {keyof typeof GRADES} grade @param {Array<String>} hardSkills @param {String} company   */
	constructor(name, hardSkills, company, grade) {
		this.name = name;
		this.hardSkills = hardSkills;
		this.grade = grade || GRADES.L1;
		this.company = company;
	}


	changeCompany(newCompany) {
		this.company = newCompany;
	}

	upGrade() {
		switch (this.grade) {
			case GRADES.L1:
				this.grade = GRADES.L2;
				break;
			case GRADES.L2:
				this.grade = GRADES.L3;
				break;
			case GRADES.L3:
				this.grade = GRADES.L4;
				break;
			case GRADES.L4:
				break;
		}
	}

	addSkill(skillName) {
		this.hardSkills.push(skillName);
	}
}

let e = new Employee("hi", ['hi'], 'hi', GRADES.L1)
c
