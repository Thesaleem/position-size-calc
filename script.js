'use strict'
const tradeCapital = document.querySelector('#capital');
const percentRisk = document.querySelector('#risk');
const entryPrice = document.querySelector('#entry');
const stopLoss = document.querySelector('#stop');
const profitTarget = document.querySelector('#target');
const positionSize = document.querySelector('.pos-size');
const positionSizeCoin = document.querySelector('.pos-size-curr');
const estimatedProfit = document.querySelector('.profit');
const tradeRisk = document.querySelector('.risk')
const percentTarget = document.querySelector('.target')
const percentStopLoss = document.querySelector('.stop-loss')
const riskRewardRatio = document.querySelector('.rrr')
const summary = document.querySelector('.summary')
const reset = document.querySelector('.reset-btn')
const input = document.querySelectorAll('input')
const tradePos = document.querySelectorAll('.position')
const tradePosBtn = document.querySelector('.trade-type')
const resultDiv = document.querySelector('.child-2-con')
const warningMsgDiv = document.querySelector('.warning_message-modal')
const warningMsg = document.querySelector('.msg')
const address = document.querySelector('.addy')
const copyIcon = document.querySelector('.copy-icon')
const successMsg = document.querySelector('.sucess')
const failedMsg = document.querySelector('.failed')


class App {
    #position = 'Long';
    constructor(){
        this._inputPrevent()
        tradePosBtn.addEventListener('click', this._tradePosFunc.bind(this))
        tradeCapital.addEventListener('input', this._tradeCapitalInput.bind(this))
        percentRisk.addEventListener('input', this._tradeCapitalInput.bind(this))
        entryPrice.addEventListener('input', this._checkInput.bind(this))
        stopLoss.addEventListener('input', this._checkInput.bind(this))
        profitTarget.addEventListener('input', this._checkInput.bind(this))
        reset.addEventListener('click', this._resetFunc.bind(this))
        copyIcon.addEventListener('click', this._copyAddress.bind(this))
    }
    _inputPrevent(){
        //prevent mouse wheeling of numbers 
        input.forEach(inp => inp.addEventListener('wheel',(e) => e.preventDefault(), {passive: false}))
    }
    //tried looping to validate inputs but it didn't work inside the methods so i found another way
    // _positiveInputs(...input){
    //     input.every(inp => inp > 0)
    // }
    // _emptyInputs(...input){
    //     input.every(inp => inp === "")
    // }

    // selects trade position, either long or short
    _tradePosFunc (e){
        let trade = e.target.closest('.position')
        if(!trade) return;
        tradePos.forEach(btn => btn.classList.remove('active'))
        trade.classList.add('active')
        this.#position = trade.innerText
    }
    //checks
    _tradeCapitalInput(e){
        const check = function(){
            return entryPrice.value === '' && stopLoss.value === '' && profitTarget.value === '';
        }
        tradeRisk.innerText = `$${((+percentRisk.value/100) * tradeCapital.value).toFixed(2)}`
        if(check()) return;
        this._posSizeCalc(+tradeCapital.value, +entryPrice.value, +stopLoss.value, +percentRisk.value,+profitTarget.value)    
    }
    _resetsomeFunc(){
        summary.innerText = "";
        
        positionSize.innerText = estimatedProfit.innerText = `$0`
        
        percentStopLoss.innerText = percentTarget.innerText = riskRewardRatio.innerText = positionSizeCoin.innerText = `0`          
    }

    //Method for refactoring code
    _activeClass (a, b){
        resultDiv.classList.add('active')
        warningMsgDiv.classList.add('active')
        warningMsg.innerText =`${a} must be greater than ${b}`
    }
    _checkInput(e){    
        const positiveInput = () => {
            return +tradeCapital.value > 0 && +entryPrice.value > 0 && +stopLoss.value > 0 && +percentRisk.value > 0 && +profitTarget.value > 0 
        }
        resultDiv.classList.remove('active')
        warningMsgDiv.classList.remove('active')
        warningMsg.innerText =``
        if(this.#position === 'Long' && (+stopLoss.value > +entryPrice.value)) {
            this._activeClass('Entry Price', 'Stop Loss')
        }
        if(this.#position === 'Short' && !(+stopLoss.value > +entryPrice.value)) {
            this._activeClass('Stop Loss', "Entry Price")
        }
        if(!positiveInput()) this._resetsomeFunc()
        if(positiveInput()) this._posSizeCalc(+tradeCapital.value, +entryPrice.value, +stopLoss.value, +percentRisk.value,+profitTarget.value)
        
        //didn't work, so i used above method
        // if(!positiveInputs(tC, eP, sL, pR, pT) || emptyInputs(eP, sL, pT)) {
        //     this._posSizeCalc(tC, eP, sL, pR, pT)
        //     console.log(yes);
        //     };
 
        // this._posSizeCalc(tC, eP, sL, pR, pT)
    }
    _posSizeCalc(capital, entry, stop, risk, target){
        
        //check for long or shorts
        const checkValue = (entry, target) => {
            let value;
            if (this.#position === 'Long'){
                value = (target - entry)/entry
            }
            else{
                value = (entry - target)/entry
            }
            return value;
        }
        const numFormat = new Intl.NumberFormat(navigator.locale,{
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'narrowSymbol'
        })

        const riskAmount = ((risk/100) * capital).toFixed(2)
        const stopLossDistance =  Math.abs(entry - stop)/entry
        const posSize =  (riskAmount/stopLossDistance.toFixed(4)).toFixed(2);
        const posSizeCoin = (posSize/entry).toFixed(2)
        const potentialProfit = (checkValue(entry, target) * posSize).toFixed(2)
        const targetperc = (checkValue(entry, target) * 100).toFixed(2)
        const stopLossPerc = (stopLossDistance.toFixed(4) * 100 ).toFixed(2)
        const riskReward = (potentialProfit/riskAmount).toFixed(2)
        
        
        positionSize.innerText = `${numFormat.format(posSize)}`
        positionSizeCoin.innerText = `${posSizeCoin}`
        estimatedProfit.innerText = `${numFormat.format(potentialProfit)}`
        tradeRisk.innerText = `${numFormat.format(riskAmount)}`
        percentTarget.innerText = `${targetperc}%`
        percentStopLoss.innerText = `${stopLossPerc}%`
        riskRewardRatio.innerText = riskReward;
        summary.innerText = `${this.#position === 'Long' ? '📈' :'📉'} You are taking a ${this.#position === 'Long' ? 'long': 'short'} position with a size of ${numFormat.format(posSize)}, a risk of ${numFormat.format(riskAmount)} if trade is lost and an estimated profit of ${numFormat.format(potentialProfit)} if trade is won. Goodluck! 👍🏽`
    }
    _resetFunc(){
        tradeCapital.value = percentRisk.value = entryPrice.value = stopLoss.value = profitTarget.value = summary.innerText = "";
        
        positionSize.innerText = estimatedProfit.innerText = tradeRisk.innerText = `$0`
        
        percentStopLoss.innerText = percentTarget.innerText = riskRewardRatio.innerText = positionSizeCoin.innerText = `0`  
        
        resultDiv.classList.remove('active')
        warningMsgDiv.classList.remove('active')
        warningMsg.innerText = ``
    }
    _clipboardMsg(a){
        a.classList.remove('visible')
        setTimeout(() => {
        a.classList.add('visible')
        }, 1300)
    }
    _copyAddress(){
        navigator.clipboard.writeText(address.innerText).then(() => {
        this._clipboardMsg(successMsg)
        }, () => {
        this._clipboardMsg(failedMsg)
        })
    }
}

const Calc = new App()

