/* В продолжение прошлого задания вам нужно нужно создать 5 новых классов:

**Company** - класс описывающий IT компанию. Состоит из:
1. Св-ва:
- companyName
- currentProjects - текущий пулл проектов. Массив экземпляров класса Project
- completedProjects - пулл завершенных проектов. Массив экземпляров класса Project
- staff - весь пулл сотрудников компании. Это объект, у которого есть поля Developers, Managers. В этих полях лежат массивы экземпляров аналогичных классов.
2. Методы:
- addNewCompanyMember() - позволяет нанять нового сотрудника. В результате метода у выбранного сотрудника
должно смениться имя компании.
- addProject() - позволяет добавить проект в пулл текущих.
- getMembersQuantity() - позволяет получить кол-во сотрудников, работающих в данной компании
- completeProject(project) - позволяет закончить проект. В результате выполнения функции проект из currentProjects перемещается в completedProjects. У команды данного проекта должно увеличиться кол-во завершенных проектов.

**Project** - класс описывающий проект компании. На проекте может быть только 1 менеджер! Каждый сотрудник может работать только над одним проектом! Состоит из:
1. Св-ва:
- projectName
- minQualification - минимальная квалификация сотрудника, для работы на данном проекте.
- team - команда проекта. Объект, типа {manager: Manager, developers: {Frontend : [], backend: []}}. В св-ва этого объекта указан массив аналогичных классов.

2. Методы:
- addNewProjectMember(member) - Метод внутри которого вызывается проверка менеджера на то, подходит ли сотрудник проекту. Если подходит, то команда расширяется, иначе нет.


**Backend Developer** - Класс, который наследуется от класса Employee. 
1.Имеет новые св-ва:
- stack - Массив в котором указаны технологии, которыми владеет разработчик.
- developerSide - 'backend'
- projectQuantity - Число завершенных проектов.
2. Методы:
- expandStack(someTech) - разработчик может увеличить стек технологий.

**Frontend Developer** - Класс, который наследуется от класса Employee.
1.Имеет новые св-ва:
- stack - Массив в котором указаны технологии, которыми владеет разработчик.
- developerSide - 'frontend'
- projectQuantity - Число завершенных проектов.
- projectQuantity - Число завершенных проектов.
2. Методы:
- expandStack(someTech) - разработчик может увеличить стек технологий.

**Manager** - Класс, который наследуется от класса Employee. 
1.Имеет новые св-ва:
- projectQuantity - Число завершенных проектов.
2. Методы:
- checkMember(minQualification, member) - менеджер проверяет, удовлетворяет ли сотрудник условиям проекта. Сотрудник, состоящий в другой компании не может работать над проектом другой компании.

*/

import { Employee, GRADES, isGradeBiggerOrEqualTo } from "./classes";

/* Св-ва и методы класса
companyName - string
currentProjects - Массив экземпляров класса Project
completedProjects -  Массив экземпляров класса Project
staff - {
    developers :  {
    frontend : массив содержащий экземпляры класса FrontendDeveloper
    backend : массив содержащий экземпляры класса BackendDeveloper
    },
    managers: массив содержащий экземпляры класса Manager
}

addNewCompanyMember(Developer/Manager) - в кач-ве аргумента принимает экземпляр класса FrontendDeveloper, BackendDeveloper или Manager
addProject(Project) - в кач-ве аргумента принимает экземпляр класса Project
getMembersQuantity()
completeProject()
*/
export class Company {
	companyName
	/** @type Array<Project> текущий пулл проектов. Массив экземпляров класса Project */
	currentProjects = [];
	/** @type Array<Project> пулл завершенных проектов. Массив экземпляров класса Project */
	completedProjects = [];
	/** @type Array<Employee> весь пулл сотрудников компании.Это объект, у которого есть поля Developers, Managers.В этих полях лежат массивы экземпляров аналогичных классов. */
	staff = [];


	/** @param {Employee} empl  */
	addNewCompanyMemer(empl) {
		this.staff.push(empl)
		empl.changeCompany(this.companyName)
	}

	/** @param {Project} prj  */
	addProject(prj) {
		this.currentProjects.push(prj)
	}

	getMembersQuantity() {
		return this.staff.length
	}

	/** @param {Project} prj */
	completeProject(prj) {
		this.currentProjects = this.currentProjects.filter(p => p != prj);
		this.completedProjects.push(prj);
		prj.team.manager.projectQuantity++;
		prj.team.developers.backend.forEach(dev => dev.projectQuantity++)
		prj.team.developers.frontend.forEach(dev => dev.projectQuantity++)
	}
}


/*
- projectName - string
- minQualification -string
- team -  {
   manager : экземпляр класса Manager
   developers: {
   frontend : массив содержащий экземпляры класса FrontendDeveloper
   backend : массив содержащий экземпляры класса BackendDeveloper
   }
}

addNewProjectMember(Developer) - Метод внутри которого вызывается проверка менеджера на то, подходит ли сотрудник проекту. Если подходит, то команда расширяется, иначе нет.
*/

export class Project {

	/** @type String */
	projectName;
	/** @type String */
	minQualification;
	/** @type {{manager: Manager; developers: {frontend: FrontendDeveloper[]; backend: BackendDeveloper[]}}} */
	team;


	/** @param {Employee} dev */
	addNewProjectMember(dev) {
		if (!this.team.manager) return;
		if (!this.team.manager.checkMember(GRADES, dev)) return;
		if (dev instanceof FrontendDeveloper) {
			this.team.developers.frontend.push(dev);
		} else {
			this.team.developers.backend.push(dev);
		}
	}
}

/*
projectQuantity - number
checkMember(minQualification, member) - в качестве аргумента принимается строка ('L1'/'L2'/'L3'/'L4') и BackendDeveloper || FrontendDeveloper
*/
export class Manager extends Employee {
	/** @type number */
	projectQuantity = 0;

	/**
	* @param {FrontendDeveloper | BackendDeveloper} member 
	* @param {keyof typeof GRADES} minQualification 
	* @returns {Boolean} canJoin
	*/
	checkMember(minQualification, member) {
		return isGradeBiggerOrEqualTo(member.grade, minQualification)
	}
}

/*
stack - массив строк
- developerSide - строка ('frontend')
- projectQuantity - number
expandStack(newTech) - в кач-ве аргумента принимает строку
*/

export class FrontendDeveloper extends Employee {
	/** @type String */
	stack;
	/** @type String */
	developerSide = "frontend";
	/** @type Number */
	projectQuantity;

	expandStack(newTech) {
		this.stack.push(newTech)
	}
}

/*
stack - массив строк
- developerSide - строка ('backend')
- projectQuantity - number
expandStack(newTech) - в кач-ве аргумента принимает строку
*/

export class BackendDeveloper extends Employee {
	/** @type String */
	stack;
	/** @type String */
	developerSide = "backend";
	/** @type Number */
	projectQuantity;


	expandStack(newTech) {
		this.stack.push(newTech)
	}
}
