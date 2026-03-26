import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Container,
  Link,
  Body,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Your verification code is {otp}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Verification Code</Heading>
          </Section>
          
          <Section style={content}>
            <Text style={text}>Hello <strong>{username}</strong>,</Text>
            <Text style={text}>
              Thank you for registering! Please use the following verification code to complete your account setup. This code is valid for 10 minutes.
            </Text>
            
            {/* OTP Display Box */}
            <Section style={codeContainer}>
              <Text style={codeText}>{otp}</Text>
            </Section>

            <Text style={text}>
              If you did not request this code, please ignore this email or contact support if you have concerns.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Sent by YourCompany Inc. <br />
              123 Tech Lane, Silicon Valley, CA
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// --- Styles ---

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  border: "1px solid #e6ebf1",
};

const header = {
  padding: "0 48px",
};

const h1 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.25",
  margin: "16px 0",
};

const content = {
  padding: "0 48px",
};

const text = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const codeContainer = {
  background: "rgba(0,0,0,.05)",
  borderRadius: "4px",
  margin: "24px 0",
  verticalAlign: "middle",
  width: "280px",
  textAlign: "center" as const,
};

const codeText = {
  color: "#000",
  display: "inline-block",
  fontSize: "32px",
  fontWeight: "700",
  letterSpacing: "6px",
  lineHeight: "40px",
  padding: "12px 0",
  width: "100%",
};

const footer = {
  padding: "0 48px",
  marginTop: "32px",
};

const footerText = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "16px",
};