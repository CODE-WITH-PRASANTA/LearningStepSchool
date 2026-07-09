import React from 'react';
import { FaDollarSign, FaFileInvoiceDollar } from 'react-icons/fa';
import './SalaryDetails.css';
import SalaryHeader from '../SalaryHeader/SalaryHeader';

const SalaryDetails = () => {
  // Data sets representing your reference layout
  const salaryComponents = [
    { component: 'Basic Pay', monthly: '$45,000', annual: '$540,000' },
    { component: 'House Rent Allowance (HRA)', monthly: '$22,500', annual: '$270,000' },
    { component: 'Conveyance Allowance', monthly: '$1,600', annual: '$19,200' },
    { component: 'Medical Allowance', monthly: '$1,250', annual: '$15,000' },
    { component: 'Special Allowance', monthly: '$15,000', annual: '$180,000' },
    { component: 'LTA', monthly: '$5,000', annual: '$60,000' },
  ];

  const deductions = [
    { component: 'Provident Fund (PF)', monthly: '$1,800', annual: '$21,600' },
    { component: 'Professional Tax', monthly: '$200', annual: '$2,400' },
    { component: 'TDS (Estimated)', monthly: '$5,500', annual: '$66,000' },
  ];

  return (
    <>
    <SalaryHeader />
    <div className="SalaryDetails-dashboard">
      <div className="SalaryDetails-grid-layout">
        
        {/* LEFT COLUMN: Earnings, Deductions, and Net Take Home Pay */}
        <div className="SalaryDetails-main-column">
          <div className="SalaryDetails-white-card">
            
            {/* Earnings Section */}
            <h2 className="SalaryDetails-section-title">Salary Components</h2>
            <table className="SalaryDetails-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th className="text-right">Monthly Amount</th>
                  <th className="text-right">Annual Amount</th>
                </tr>
              </thead>
              <tbody>
                {salaryComponents.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'zebra-row' : ''}>
                    <td>{item.component}</td>
                    <td className="text-right font-medium">{item.monthly}</td>
                    <td className="text-right font-medium">{item.annual}</td>
                  </tr>
                ))}
                <tr className="SalaryDetails-total-row earnings-total">
                  <td>Total Earnings (A)</td>
                  <td className="text-right font-bold">$90,350</td>
                  <td className="text-right font-bold">$1,084,200</td>
                </tr>
              </tbody>
            </table>

            {/* Deductions Section */}
            <h2 className="SalaryDetails-section-title spacing-top">Deductions</h2>
            <table className="SalaryDetails-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th className="text-right">Monthly Amount</th>
                  <th className="text-right">Annual Amount</th>
                </tr>
              </thead>
              <tbody>
                {deductions.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.component}</td>
                    <td className="text-right font-medium">{item.monthly}</td>
                    <td className="text-right font-medium">{item.annual}</td>
                  </tr>
                ))}
                <tr className="SalaryDetails-total-row deductions-total">
                  <td>Total Deductions (B)</td>
                  <td className="text-right font-bold">$7,500</td>
                  <td className="text-right font-bold">$90,000</td>
                </tr>
              </tbody>
            </table>

            {/* Net Take Home Pay Banner */}
            <div className="SalaryDetails-net-pay-banner">
              <span className="net-pay-title">Net Take Home Pay (A - B)</span>
              <div className="net-pay-value-container">
                <span className="net-pay-amount">$82,850</span>
                <span className="net-pay-subtitle">Per Month</span>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Visual Summary Metric Cards & Payment Metadata Info */}
        <div className="SalaryDetails-side-column">
          
          {/* Total CTC Summary Badge */}
          <div className="SalaryDetails-metric-card ctc-card">
            <div className="metric-content">
              <span className="metric-label">Total CTC (Annual)</span>
              <h3 className="metric-value">$1,084,200</h3>
            </div>
            <FaDollarSign className="metric-bg-icon" />
          </div>

          {/* Tax Savings Metric Badge */}
          <div className="SalaryDetails-metric-card tax-card">
            <div className="metric-content">
              <span className="metric-label">Tax Savings</span>
              <h3 className="metric-value">$12,500</h3>
            </div>
            <FaFileInvoiceDollar className="metric-bg-icon" />
          </div>

          {/* Banking / Identification Payment Metadata details card */}
          <div className="SalaryDetails-info-card">
            <h4 className="info-card-title">Payment Info</h4>
            <div className="info-grid-row">
              <span className="info-label">Bank Name</span>
              <span className="info-value">HDFC Bank</span>
            </div>
            <div className="info-grid-row">
              <span className="info-label">Account No</span>
              <span className="info-value font-medium">XXXX XXXX 1234</span>
            </div>
            <div className="info-grid-row">
              <span className="info-label">IFSC Code</span>
              <span className="info-value font-medium">HDFC0001234</span>
            </div>
            <div className="info-grid-row">
              <span className="info-label">PAN No</span>
              <span className="info-value font-medium">ABCDE1234F</span>
            </div>
          </div>

        </div>

      </div>
    </div>

    </>
  );
};

export default SalaryDetails;