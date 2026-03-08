export default function Terms() {
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-8">Last Updated: March 7, 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 text-sm leading-relaxed">
          <Section title="1. Acceptance of Terms">
            By accessing or using any survey tool operated by Good Human Partners, LLC (&ldquo;GHP,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), including but not limited to Pulse of the Pint and related customer experience survey platforms (collectively, the &ldquo;Service&rdquo;), you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the Service.
          </Section>

          <Section title="2. Description of Services">
            GHP operates customer experience survey tools on behalf of participating businesses (&ldquo;Partner Locations&rdquo;). These tools collect feedback from customers who voluntarily choose to participate. Surveys are short-form, mobile-friendly questionnaires designed to capture visit experience, preferences, and general feedback.
          </Section>

          <Section title="3. Eligibility">
            You must be at least 21 years of age to participate in any survey offered through the Service. By using the Service, you represent and warrant that you are at least 21 years old.
          </Section>

          <Section title="4. Voluntary Participation">
            Participation in any survey is entirely voluntary. You may exit the survey at any time without consequence. You are not required to answer any question or provide any personal information.
          </Section>

          <Section title="5. Incentives and Rewards">
            Some Partner Locations may offer incentives for survey completion. Incentive details, eligibility, and fulfillment are determined by the Partner Location and are subject to their own terms. GHP facilitates the survey but does not guarantee or administer rewards unless explicitly stated.
          </Section>

          <Section title="6. User Conduct">
            <p>By using the Service, you agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide false or misleading information</li>
              <li>Complete surveys multiple times for the same visit</li>
              <li>Attempt to manipulate, hack, or exploit the Service</li>
              <li>Use the Service for any unlawful purpose</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Impersonate another person or entity</li>
            </ul>
          </Section>

          <Section title="7. Intellectual Property">
            All content, design, software, and materials associated with the Service are the property of Good Human Partners, LLC and are protected by applicable intellectual property laws. Partner Location logos and brand assets are used with permission for survey branding purposes only.
          </Section>

          <Section title="8. Data Ownership">
            Survey response data collected through the Service is owned by Good Human Partners, LLC. Aggregated and anonymized insights may be shared with Partner Locations and used for market research purposes. See our Privacy Policy for details.
          </Section>

          <Section title="9. Data Use for Research and Model Training">
            <p className="font-medium text-gray-700 mt-2">a) Anonymized Data for Model Training</p>
            <p>By using the Service, you agree that GHP may use aggregated, anonymized survey response data to develop, train, improve, and refine our proprietary analytical models. No personally identifiable information (PII) will be used in these exercises.</p>

            <p className="font-medium text-gray-700 mt-4">b) Invitation to Participate in Market Research</p>
            <p>By providing your contact information, you agree that GHP and its affiliated entities may contact you to invite you to participate in additional market research opportunities. You may opt out at any time.</p>
          </Section>

          <Section title="10. Disclaimers">
            The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, express or implied. GHP is not responsible for the products, services, or conduct of any Partner Location.
          </Section>

          <Section title="11. Limitation of Liability">
            To the fullest extent permitted by law, Good Human Partners, LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to your use of the Service. In no event shall GHP&apos;s total liability exceed $100.
          </Section>

          <Section title="12. Indemnification">
            You agree to indemnify and hold harmless Good Human Partners, LLC from any claims, damages, losses, or expenses arising from your use of the Service or violation of these Terms.
          </Section>

          <Section title="13. Modifications">
            We reserve the right to modify these Terms at any time. Changes will be effective upon posting. Your continued use of the Service constitutes acceptance of the revised Terms.
          </Section>

          <Section title="14. Governing Law">
            These Terms shall be governed by and construed in accordance with the laws of the State of Connecticut. Any disputes shall be resolved in the state or federal courts located in Connecticut.
          </Section>

          <Section title="15. Contact Information">
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
