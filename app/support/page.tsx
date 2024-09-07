function SupportPage() {
  return (
    <section className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-semibold ">Support</h1>
      <div className="bg-white dark:bg-slate-950  p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-6">
          If you need assistance with managing your job postings, viewing
          applicants, or any other company-related issues, feel free to contact
          us.
        </p>
        <h3 className="text-lg font-semibold mb-4">Email Support</h3>
        <p className="mb-4">
          Reach us at{' '}
          <a href="mailto:support@company.com" className="text-blue-600">
            support@company.com
          </a>{' '}
          for inquiries.
        </p>
        <h3 className="text-lg font-semibold mb-4">Call Support</h3>
        <p className="mb-4">
          Call us at{' '}
          <a href="mailto:support@company.com" className="text-blue-600">
            +1-111-111-1111
          </a>{' '}
          for full support.
        </p>
        <h3 className="text-lg font-semibold mb-4">FAQ</h3>
        <ul className="list-disc ml-6">
          <li>How do I post a job?</li>
          <li>How do I view applicants?</li>
          <li>Can I edit a job posting after it's live?</li>
        </ul>
      </div>
    </section>
  );
}
export default SupportPage;
