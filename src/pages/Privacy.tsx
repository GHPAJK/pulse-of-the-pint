export default function Privacy() {
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last Updated: March 7, 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 text-sm leading-relaxed">
          <Section title="1. Introduction">
            Good Human Partners, LLC (&ldquo;GHP,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your information when you participate in customer experience surveys operated through our survey platforms (the &ldquo;Service&rdquo;). By using the Service, you consent to the practices described in this Privacy Policy.
          </Section>

          <Section title="2. Information We Collect">
            <p className="font-medium text-gray-700 mt-2">a) Information You Provide Voluntarily</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Survey responses (your answers to survey questions)</li>
              <li>Contact information, if you choose to provide it: first name, email address, zip code, mobile phone number</li>
              <li>Any open-ended text responses you submit</li>
            </ul>
            <p className="mt-2">Note: Providing personal contact information is optional. You may complete a survey without sharing any personally identifiable information.</p>

            <p className="font-medium text-gray-700 mt-4">b) Information Collected Automatically</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Device type (mobile, desktop, tablet)</li>
              <li>Browser type and version</li>
              <li>Approximate location based on IP address (city/state level only)</li>
              <li>Date and time of survey participation</li>
              <li>Survey completion status and duration</li>
              <li>Referring source (QR code, link, etc.)</li>
            </ul>

            <p className="font-medium text-gray-700 mt-4">c) Information We Do NOT Collect</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Full home address</li>
              <li>Social Security number</li>
              <li>Financial or payment information</li>
              <li>Government-issued identification</li>
              <li>Health or medical records</li>
              <li>Biometric data</li>
              <li>Precise GPS location</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide survey functionality and deliver results to Partner Locations</li>
              <li>Generate aggregated, anonymized insights and reports</li>
              <li>Administer rewards, incentives, or sweepstakes entries (if applicable)</li>
              <li>Communicate with you about survey-related matters (only if you opt in)</li>
              <li>Improve our Service and survey design</li>
              <li>Comply with legal obligations</li>
              <li>Detect and prevent fraud or misuse</li>
              <li>Develop and improve our proprietary analytical models using aggregated, anonymized data only (no PII is used for model training)</li>
              <li>Invite you to participate in additional market research projects operated by GHP or its affiliated entities (only if you have provided contact information and have not opted out)</li>
            </ul>
          </Section>

          <Section title="4. How We Share Your Information">
            <p className="font-medium text-gray-700 mt-2">a) With Partner Locations</p>
            <p>We may share aggregated, anonymized survey results with the Partner Location where you completed the survey. We will NOT share your personal contact information with Partner Locations unless you explicitly opt in.</p>

            <p className="font-medium text-gray-700 mt-4">b) With Service Providers</p>
            <p>We may share information with trusted third-party service providers who assist us in operating the Service. These providers are bound by contractual obligations to protect your information.</p>

            <p className="font-medium text-gray-700 mt-4">c) For Legal Compliance</p>
            <p>We may disclose information if required to do so by law, court order, or governmental regulation.</p>

            <p className="font-medium text-gray-700 mt-4">d) We Do NOT Sell Your Information</p>
            <p>We do not sell, rent, or trade your personal information to third parties for marketing purposes. Period.</p>
          </Section>

          <Section title="5. Data Retention">
            <ul className="list-disc pl-5 space-y-1">
              <li>Survey response data (anonymized) is retained indefinitely for research and analytics purposes.</li>
              <li>Personal contact information is retained for as long as you maintain an active relationship with the Service, or until you request deletion.</li>
            </ul>
          </Section>

          <Section title="6. Data Security">
            We implement industry-standard security measures including encryption of data in transit (HTTPS/TLS), encryption of sensitive data at rest, access controls, and regular security reviews. However, no method of transmission or storage is 100% secure.
          </Section>

          <Section title="7. Cookies and Tracking">
            The Service may use essential cookies to maintain survey session state. We do not use advertising cookies or third-party tracking cookies.
          </Section>

          <Section title="8. Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Access</strong> &mdash; Request a copy of your personal information</li>
              <li><strong>Correction</strong> &mdash; Request correction of inaccurate information</li>
              <li><strong>Deletion</strong> &mdash; Request deletion of your personal information</li>
              <li><strong>Opt Out</strong> &mdash; Withdraw consent for marketing communications at any time</li>
              <li><strong>Portability</strong> &mdash; Request your data in a structured, machine-readable format</li>
            </ul>
            <p className="mt-2">To exercise any of these rights, contact us at info@goodhumanpartners.com. We will respond within 30 days.</p>
          </Section>

          <Section title="9. Children's Privacy">
            The Service is not intended for individuals under the age of 21. We do not knowingly collect personal information from anyone under 21.
          </Section>

          <Section title="10. Changes to This Policy">
            We may update this Privacy Policy from time to time. When we do, we will revise the &ldquo;Last Updated&rdquo; date. Your continued use of the Service constitutes acceptance of the updated policy.
          </Section>

          <Section title="11. Contact Information">
            <p>Good Human Partners, LLC</p>
            <p>Email: info@goodhumanpartners.com</p>
            <p>Web: goodhumanpartners.com</p>
          </Section>
        </div>
      </div>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
