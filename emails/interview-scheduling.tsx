import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Img,
} from "@react-email/components";

interface InterviewEmailProps {
  candidateName: string;
  position: string;
  interviewDate: string;
  interviewTime: string;
  companyName?: string;
  interviewFormat: string;
}

export const InterviewNotification = ({
  candidateName,
  position,
  interviewDate,
  interviewTime,
  companyName = "Interviewly",
  interviewFormat,
}: InterviewEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Your Interview Has Been Scheduled - Please Login to Interviewly
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header with Logo */}
          <Section style={styles.header}>
            <div style={styles.logoContainer}>
              <div style={styles.logoIcon}>
                <div style={styles.logoGradient}></div>
                <div style={styles.logoGlow}></div>
              </div>
              <Text style={styles.brandText}>Interviewly</Text>
            </div>
            <Text style={styles.headerTitle}>Interview Scheduled</Text>
            <Text style={styles.headerSubtitle}>
              Your next step towards success
            </Text>
          </Section>

          <Section style={styles.content}>
            <Text style={styles.greeting}>Hello, {candidateName} 👋</Text>

            <Text style={styles.message}>
              Great news! Your interview for the <strong>{position}</strong> role has been scheduled. 
              We're excited to help you showcase your skills and experience.
            </Text>

            {/* Interview Details Card */}
            <Section style={styles.detailsCard}>
              <Text style={styles.detailsTitle}>📅 Interview Details</Text>
              
              <div style={styles.detailRow}>
                <div style={styles.detailLabel}>Date</div>
                <div style={styles.detailValue}>{interviewDate}</div>
              </div>
              
              <div style={styles.detailRow}>
                <div style={styles.detailLabel}>Time</div>
                <div style={styles.detailValue}>{interviewTime}</div>
              </div>
              
              <div style={styles.detailRow}>
                <div style={styles.detailLabel}>Format</div>
                <div style={styles.detailValue}>{interviewFormat}</div>
              </div>
              
              <div style={styles.detailRow}>
                <div style={styles.detailLabel}>Duration</div>
                <div style={styles.detailValue}>45 minutes</div>
              </div>
            </Section>

            {/* Security Notice */}
            <Section style={styles.securityNotice}>
              <div style={styles.securityIcon}>🔒</div>
              <Text style={styles.securityText}>
                <strong>Security Notice:</strong> Please log in to your Interviewly dashboard 
                at least 15 minutes before your scheduled interview time for a secure connection.
              </Text>
            </Section>

            {/* CTA Button */}
            <Button
              href="https://interviewly-vert.vercel.app/"
              style={styles.ctaButton}
            >
              🚀 Login to Interviewly Dashboard
            </Button>

            <Text style={styles.buttonNote}>
              Use your existing credentials to securely access your interview portal
            </Text>

            {/* Additional Info */}
            <Section style={styles.infoSection}>
              <Text style={styles.infoTitle}>💡 What to Expect</Text>
              <Text style={styles.infoText}>
                • Real-time coding challenges and problem-solving<br/>
                • Interactive whiteboard collaboration<br/>
                • AI-powered feedback and insights<br/>
                • Professional interview experience
              </Text>
            </Section>

            <Text style={styles.supportText}>
              Need to reschedule or have questions? Contact us at{" "}
              <a href="mailto:support@interviewly.com" style={styles.link}>
                support@interviewly.com
              </a>
            </Text>

            {/* Footer */}
            <Section style={styles.footer}>
              <div style={styles.footerContent}>
                <Text style={styles.signatureText}>Best regards,</Text>
                <Text style={styles.signatureName}>The Interviewly Team</Text>
                <Text style={styles.companyName}>{companyName}</Text>
              </div>
              
              <div style={styles.footerDivider}></div>
              
              <Text style={styles.footerText}>
                © 2025 {companyName}. All rights reserved.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default InterviewNotification;

const styles = {
  body: {
    backgroundColor: "#ffffff",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "20px",
    margin: 0,
    lineHeight: "1.6",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    maxWidth: "600px",
    margin: "auto",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)",
    padding: "40px 30px 30px",
    textAlign: "center" as const,
    position: "relative" as const,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  },
  logoIcon: {
    position: "relative" as const,
    width: "48px",
    height: "48px",
    marginRight: "12px",
  },
  logoGradient: {
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
  },
  logoGlow: {
    position: "absolute" as const,
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    background: "linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)",
    borderRadius: "12px",
    opacity: "0.6",
    animation: "pulse 2s infinite",
  },
  brandText: {
    fontSize: "28px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #ffffff 0%, #dbeafe 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: "0",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: "32px",
    fontWeight: "700",
    margin: "10px 0 8px 0",
    letterSpacing: "-0.025em",
  },
  headerSubtitle: {
    color: "#bfdbfe",
    fontSize: "16px",
    margin: "0",
    fontWeight: "500",
  },
  content: {
    padding: "40px 30px",
  },
  greeting: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "20px",
    marginTop: "0",
  },
  message: {
    fontSize: "16px",
    color: "#475569",
    lineHeight: "1.7",
    marginBottom: "30px",
    marginTop: "0",
  },
  detailsCard: {
    backgroundColor: "#f8fafc",
    padding: "24px",
    borderRadius: "12px",
    marginBottom: "30px",
    border: "1px solid #e2e8f0",
    borderLeft: "4px solid #3b82f6",
  },
  detailsTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "20px",
    marginTop: "0",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #e2e8f0",
  },
  detailLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  detailValue: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
  },
  securityNotice: {
    backgroundColor: "#fef3c7",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "30px",
    border: "1px solid #f59e0b",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },
  securityIcon: {
    fontSize: "20px",
    flexShrink: "0",
    marginTop: "2px",
  },
  securityText: {
    fontSize: "15px",
    color: "#92400e",
    margin: "0",
    lineHeight: "1.6",
  },
  ctaButton: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    padding: "16px 32px",
    borderRadius: "12px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "600",
    display: "block",
    textAlign: "center" as const,
    marginBottom: "16px",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
    transition: "all 0.2s ease",
  },
  buttonNote: {
    fontSize: "14px",
    color: "#64748b",
    textAlign: "center" as const,
    marginBottom: "30px",
    marginTop: "0",
  },
  infoSection: {
    backgroundColor: "#f0f9ff",
    padding: "24px",
    borderRadius: "12px",
    marginBottom: "30px",
    border: "1px solid #bae6fd",
  },
  infoTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0369a1",
    marginBottom: "16px",
    marginTop: "0",
  },
  infoText: {
    fontSize: "15px",
    color: "#0c4a6e",
    lineHeight: "1.8",
    margin: "0",
  },
  supportText: {
    fontSize: "15px",
    color: "#475569",
    textAlign: "center" as const,
    marginBottom: "30px",
    marginTop: "0",
  },
  link: {
    color: "#3b82f6",
    textDecoration: "none",
    fontWeight: "600",
  },
  footer: {
    borderTop: "1px solid #e2e8f0",
    paddingTop: "24px",
  },
  footerContent: {
    textAlign: "center" as const,
    marginBottom: "20px",
  },
  signatureText: {
    fontSize: "16px",
    color: "#64748b",
    margin: "4px 0",
  },
  signatureName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "4px 0",
  },
  companyName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#3b82f6",
    margin: "4px 0",
  },
  footerDivider: {
    height: "1px",
    backgroundColor: "#e2e8f0",
    margin: "20px 0",
  },
  footerText: {
    fontSize: "12px",
    color: "#94a3b8",
    textAlign: "center" as const,
    margin: "0",
  },
};
