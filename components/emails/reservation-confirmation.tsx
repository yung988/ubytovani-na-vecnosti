import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

interface ReservationEmailProps {
  guestName: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  paymentMethod: 'card' | 'bank_transfer';
  reservationId: string;
}

export const ReservationConfirmationEmail = ({
  guestName,
  startDate,
  endDate,
  guestCount,
  paymentMethod,
  reservationId,
}: ReservationEmailProps) => {
  const formattedStartDate = format(new Date(startDate), 'PPP', { locale: cs });
  const formattedEndDate = format(new Date(endDate), 'PPP', { locale: cs });

  return (
    <Html>
      <Head />
      <Preview>Potvrzení rezervace - Na Věčnosti</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Potvrzení rezervace</Heading>
          
          <Text style={text}>
            Dobrý den {guestName},
          </Text>
          
          <Text style={text}>
            děkujeme za Vaši rezervaci ubytování Na Věčnosti. Níže najdete detaily Vaší rezervace:
          </Text>

          <Section style={section}>
            <Text style={sectionItem}>
              <strong>Termín pobytu:</strong><br />
              {formattedStartDate} - {formattedEndDate}
            </Text>
            <Text style={sectionItem}>
              <strong>Počet hostů:</strong> {guestCount}
            </Text>
          </Section>

          <Hr style={hr} />

          {paymentMethod === 'bank_transfer' ? (
            <Section style={section}>
              <Text style={text}>
                <strong>Platební údaje:</strong><br />
                Číslo účtu: 123456789/0100<br />
                Variabilní symbol: {reservationId.slice(0, 10)}<br />
                Částka: 2000 Kč
              </Text>
              <Text style={text}>
                Prosím, uhraďte částku do 48 hodin pro potvrzení rezervace.
              </Text>
            </Section>
          ) : (
            <Text style={text}>
              Platba kartou bude zpracována v následujícím kroku.
            </Text>
          )}

          <Hr style={hr} />

          <Text style={footer}>
            V případě jakýchkoliv dotazů nás neváhejte kontaktovat.<br />
            S pozdravem,<br />
            Tým Na Věčnosti
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '5px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.4',
  margin: '0 0 20px',
};

const text = {
  color: '#4c4c4c',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 20px',
};

const section = {
  margin: '20px 0',
};

const sectionItem = {
  margin: '0 0 10px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '24px',
}; 