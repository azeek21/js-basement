(function() {
	const allowedChars = "1234567890.+-=x/C";
	const actionChars = '+-/x*.'
	const input = document.getElementById('result-input');
	const allBtns = document.querySelectorAll('.calc-button');


	allBtns.forEach((btn) => {
		const btnContent = btn.innerText;
		if (!btnContent || !allowedChars.includes(btnContent)) return;
		const val = Number(btnContent);

		if (Number.isSafeInteger(val) || btnContent !== '=' || btnContent !== 'C') {
			btn.addEventListener('click', (ev) => {
				let incoming = ev.target.innerText;
				let val = input.value;
				console.log('ev: ', incoming, val);

				if (incoming === 'x') {
					incoming = '*';
				}

				if (val.length === 0 && "/x*.=C".includes(incoming)) return;

				if (incoming === 'C') {
					input.value = "";
					return;
				}

				if (incoming === '=') {
					input.value = eval(val);
					return;
				}

				if (actionChars.includes(incoming)) {
					if ([].some.call(actionChars, (c) => val.endsWith(c))) {
						input.value = val.slice(0, -1) + incoming;
						return;
					}
				}

				input.value += incoming;

			})
		}
	})
})()
