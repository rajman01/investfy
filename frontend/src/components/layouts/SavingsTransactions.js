import React, { Component } from 'react'

class SavingsTransactions extends Component {
    render() {
        const transactions = this.props.transactions
        return (
          <table class="table table-bordered">
            <thead class="thead-light">
              <tr>
                <th scope="col">Transaction Type</th>
                <th scope="col">Amount</th>
                <th scope="col">Timestamp</th>
              </tr>
            </thead>
            <tbody>
                { transactions.map(transaction => (
                    <tr>
                        <td>transaction.transaction_type</td>
                        <td>transaction.amount</td>
                        <td>transaction.timestamp</td>
                    </tr>
                )) }
            </tbody>
          </table>
        )
    }
}

export default SavingsTransactions
