import React, { Component } from 'react'

class AccountTransactions extends Component {
    render() {
        const transactions = this.props.transactions;
        return (
          <table class="table table-bordered">
            <thead class="thead-light">
              <tr>
                <th scope="col">Account Number</th>
                <th scope="col">Name</th>
                <th scope="col">Amount</th>
                <th scope="col">Timestamp</th>
              </tr>
            </thead>
            <tbody>
                { transactions.map(transaction => (
                    <tr key={transaction.id}>
                        <td>{transaction.acct_no}</td>
                        <td>{transaction.name}</td>
                        <td>{transaction.amount}</td>
                        <td>{transaction.timestamp}</td>
                    </tr>
                )) }
            </tbody>
          </table>
        )
    }
}

export default AccountTransactions
