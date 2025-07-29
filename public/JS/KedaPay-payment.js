//1-  get orgin from localStorage or use current location origin like (localhost:3000 , ip:port)
let origin = window.localStorage.getItem("fp-plugin-origin");
if (!origin) {
	origin = window.location.origin;
	//console.log('Overriding origin with ' + origin);
}

// vaiables for kedapay api
const kedaplugin_frame_div_id = 'keda-payments';
//#TODO
const kedapay_api_base_url = "http://sweete-commerce.somee.com"//"https://localhost:7151/api";
const keda_plugin_origin = "https://interactive-card-details-ecru.vercel.app";


const DISPLAY_MODE_2 = {
	POPUP: 'POPUP',
	INSIDE_PAGE: 'INSIDE_PAGE',
	SIDE_PAGE: 'SIDE_PAGE',
	SEPARATED: 'SEPARATED',
}

class KedaPay {
	//1- checkout function to start payment process
    static checkout(chargeRequest, config, accessToken) {
		//debugger;
		//console.log(chargeRequest, config, "-------------------");
		config.returnUrl = chargeRequest.returnUrl;
		KedaPay.config = config;

		const isMac = navigator.userAgent.match(/Mac OS/);
		const isAppleProduct = navigator.vendor.indexOf('Apple') > -1 || window.safari !== undefined;
		if (isMac || isAppleProduct) {
			config.mode = DISPLAY_MODE_2.SEPARATED;
			chargeRequest.displayMode = DISPLAY_MODE_2.SEPARATED;
		}
		chargeRequest.paymentSource = chargeRequest.paymentSource && chargeRequest.paymentSource != ""
			? chargeRequest.paymentSource
			: 'NEW_PLUGIN';
		this.captureOrderInfo(chargeRequest, config, accessToken);
	}

	//2- captureOrderInfo function to send user data to api and get paymentId
    static captureOrderInfo(chargeRequest, config, accessToken) {
		//debugger;
		var div = document.getElementById(kedaplugin_frame_div_id) || KedaPay.createDiv();
        //جاري التحميل، برجاء الإنتظار
		div.innerHTML = config.locale === 'en' ? "loading..., wait a moment please!" : '\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u062d\u0645\u064a\u0644\u060c \u0628\u0631\u062c\u0627\u0621 \u0627\u0644\u0625\u0646\u062a\u0638\u0627\u0631'
		document.body.appendChild(div);
		const params = {
			headers: {
				'Accept': "application/json, text/plain, */*",
				'Content-Type': "application/json;charset=utf-8",
				'Authorization': accessToken && 'Bearer ' + accessToken
			},
			body: JSON.stringify(chargeRequest),
			method: "POST"
		};

		// make post request for init payment with
		//1- body : is the user data
		//2- returned : parmeter id with (transaction	ID) to retreve user data from api 
		fetch(`/api/proxy-product`, params)
			.then(response => {
				if (!response.ok) {  throw response; }
				return response.text();
			})
			.then(paymentId => {
				KedaPay.loadPlugin(paymentId, config);
			})
			.catch(error => {
				//console.log("error , failed aweeee", error);
				div.innerHTML = null
				if (typeof error.json === "function") {
					error.json()
						.then((body) => {
							onFailureCallBack(body);
						})
				} else {
					onFailureCallBack({ statusDescription: 'Connection refused!' });
				}
			});
	}

	//3- loadPlugin function to load payment plugin based on mode
	static loadPlugin(paymentId, config) {
		//debugger;
		// add parameterId in querystring
		const url = `${keda_plugin_origin}?payment-id=${paymentId}`;
		const style = KedaPay.getIframStyleBasedOnMode(config.mode);

		if (config.mode == DISPLAY_MODE_2.SEPARATED || config.mode == null) {
			window.open(url, "_self");
		} else if (config.mode === DISPLAY_MODE_2.POPUP) {
			//debugger;
			var div = document.getElementById(kedaplugin_frame_div_id) || KedaPay.createDiv();
			div.innerHTML = `<div id="id01" class="modal-f">
			<div class="modal_content">
				<div id="Keda-payments">
					<iframe src=${url}  class="responsive-iframe" frameBorder="0">

					</iframe>
				</div>
				<div id="error"></div>
				</div>
			</div>`

			//Show modal and disable body scroll
			document.body.style.overflowY = 'hidden'; // Prevent background scroll

			document.getElementById('id01').style.display = 'block';
			document.body.appendChild(div);


		} else if (config.mode === DISPLAY_MODE_2.SIDE_PAGE) {
			var div = document.getElementById(Kedaplugin_frame_div_id) || KedaPay.createDiv();
			div.innerHTML = `<div id="id02">
				  	<div class="container">
						<div id="Keda-payments">
							<iframe id='KedaPayPaymentFrame' src=${url} scrolling="yes" style="border: 0; height: 100vh !important; ${style}"/>

							<div id="error"></div>
						</div>
				  	</div>
				  </div>`
			document.getElementById('id02').style.display = 'block';
			config.mode == DISPLAY_MODE_2.SIDE_PAGE && (div.classList.add('side-page'));
			document.body.appendChild(div);

		} else {
			var div = document.getElementById(Kedaplugin_frame_div_id) || KedaPay.createDiv();
			div.innerHTML = `<iframe id='KedaPayPaymentFrame' src=${url} scrolling="${config.mode == DISPLAY_MODE_2.SIDE_PAGE ? 'yes' : 'no'}" style="border: 0; ${style}"/>`;
			config.mode == DISPLAY_MODE_2.SIDE_PAGE && (div.classList.add('side-page'));
			document.body.appendChild(div);
		}
	}


	
	static getIframStyleBasedOnMode(mode) {
		switch (mode) {
			case DISPLAY_MODE_2.INSIDE_PAGE:
			case DISPLAY_MODE_2.SIDE_PAGE:
				return 'width:100%; height:800px;'
		}
	}

    static createDiv() {
		const div = document.createElement('div');
		div.setAttribute('id', kedaplugin_frame_div_id);
		return div;
	}

}

// listen for messages from the iframe
const keda_eventMethod  = window.addEventListener ? "addEventListener" : "attachEvent"; // to support IE-8
const keda_eventListener = window[keda_eventMethod];
var keda_messageEvent = keda_eventMethod == "attachEvent" ? "onmessage" : "message"; // to support IE-8

eventListener(keda_messageEvent, keda_receiveMessage, false);

function keda_receiveMessage(message) {
	//debugger;
	if (message.origin === pluginOrigin) {
		// message dispatched from the target origin
		document.getElementById(kedaplugin_frame_div_id)?.remove();

		//Hide modal and enable body scroll:
		document.body.style.overflow = '';       // Restore scroll

		const data = message.data;
		if (data) {
			(data.status == 200 || data.statusCode == 200) ?
				onSuccessCallBack(data) :
				onFailureCallBack(data);
		}
	}
}

function onSuccessCallBack(data) {
	if (KedaPay.config) {
		KedaPay.config.onSuccess
			? KedaPay.config.onSuccess(data)
			: (window.location.href = KedaPay.config.returnUrl + mapToUrlParams(data));
	}
}

function onFailureCallBack(data) {
	//debugger;
	if (KedaPay.config) {
		//console.log("onFailureCallBack", data);
		KedaPay.config.onFailure
			? KedaPay.config.onFailure(data)
			: (window.location.href = KedaPay.config.returnUrl + mapToUrlParams(data));
	}
}