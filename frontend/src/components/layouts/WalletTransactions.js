import React, { Component } from 'react'
import { timeStamp } from '../../actions/wallet'

class WalletTransactions extends Component {
    render() {
        const transactions = this.props.transactions
        return (
          <table class="table table-bordered">
            <thead class="thead-light">
              <tr>
                <th scope="col">Sender</th>
                <th scope="col">Beneficiary</th>
                <th scope="col">Amount</th>
                <th scope="col">Timestamp</th>
              </tr>
            </thead>
            <tbody>
                { transactions.map(transaction => (
                    <tr key={transaction.id}>
                        <td>{transaction.sender ? (transaction.sender.username) : 'None'}</td>
                        <td>{transaction.beneficiary.username}</td>
                        <td>{transaction.amount}</td>
                        <td>{timeStamp(transaction.timestamp)}</td>
                    </tr>
                )) }
            </tbody>
          </table>
        )
    }
}

export default WalletTransactions
