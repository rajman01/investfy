import { GET_MY_INVESTMENTS, GET_ALL_INVESTMENTS, GET_INVESTMENT, INVEST, INVESTMENT_CASHOUT } from '../actions/types'

const initialState = {
    'my_investments': [],
    'all_investments': [],
    'investment': {
        'id': null, 
        'name': '',
        'description': '',
        'owner': {},
        'investment_type': '',
        'payout_type': '',
        'units': null,
        'units_left': null,
        'amount_per_unit': '',
        'yearly_profit_percent': null,
        'no_of_investors': null,
        'duration': null,
        'sold_out': false,
        'data_type': 'normal',
        'date_approved': ''
    }
}


export default function (state=initialState, action){
    switch(action.type){
        case GET_MY_INVESTMENTS:
            return {
                ...state,
                my_investments: action.payload
            }

        case GET_ALL_INVESTMENTS:
            return {
                ...state,
                all_investments: action.payload
            }
        case GET_INVESTMENT:
            return {
                ...state,
                investment: action.payload
            }
        case INVEST:
            
            const profit = (state.investment.yearly_profit_percent / 100) * parseFloat(state.investment.amount_per_unit)
            const yearly_profit = profit * parseFloat(action.payload.units_bought);
            let yearly_gain;
            const sold_out = (state.investment.units - action.payload.units_bought) === 0
            if (state.investment.payout_type === 'profit'){
                yearly_gain = yearly_profit;
            }else{
                yearly_gain = yearly_profit + (parseFloat(state.investment.amount_per_unit) * action.payload.units_bought)
            }
            if (state.investment.data_type === 'investment for owner'){
                return{
                    ...state,
                    investment: {
                        ...state.investment,
                        total_amount : `${parseFloat(state.investment.total_amount) + parseFloat(action.payload.amount)}`,
                        units_left: state.investment.units_left - action.payload.units_bought,
                        sold_out,
                        transactions: [action.payload, ...state.investment.transactions],
                        units_bought: action.payload.units_bought + state.investment.units_bought
                    }
                    
                }

            }else if (state.investment.data_type === 'investment for investors'){
                return {
                    ...state,
                    investment: {
                        ...state.investment,
                        units_left: state.investment.units_left - action.payload.units_bought,
                        yearly_gain: state.investment.yearly_gain + yearly_gain,
                        yearly_profit: state.investment.yearly_profit + yearly_profit,
                        sold_out,
                        transactions: [action.payload, ...state.investment.transactions],
                        units_bought: action.payload.units_bought + state.investment.units_bought
                    }
                }
            }else {
                return{
                    ...state,
                    investment: {
                        ...state.investment,
                        data_type: 'investment for investors',
                        units_left: state.investment.units_left - action.payload.units_bought,
                        yearly_gain,
                        yearly_profit,
                        no_of_investors: state.investment.no_of_investors + 1,
                        transactions: [action.payload],
                        sold_out,
                        units_bought: action.payload.units_bought
                    }
                }
            }

        case INVESTMENT_CASHOUT:
            return {
                ...state,
                investment: {
                    ...state.investment,
                    total_amount: '0.00'
                }
            }
        default:
            return state
    }
}