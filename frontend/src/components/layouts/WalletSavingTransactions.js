import React, { Component } from 'react'

class WalletSavingTransactions extends Component {
    render() {
        const transactions = this.props.transactions
        return (
          <table class="table table-bordered">
            <thead class="thead-light">
              <tr>
                <th scope="col">Savings Account</th>
                <th scope="col">Transaction Type</th>
                <th scope="col">amount</th>
                <th scope="col">Timestamp</th>
              </tr>
            </thead>
            <tbody>
                { transactions.map(transaction => (
                    <tr key={transaction.id}>
                        <td>{transaction.savings_account}</td>
                        <td>{transaction.transaction_type}</td>
                        <td>{transaction.amount}</td>
                        <td>{transaction.timestamp}</td>
                    </tr>
                )) }
            </tbody>
          </table>
        )
    }
}

export default WalletSavingTransactions
