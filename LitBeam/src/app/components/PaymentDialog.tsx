import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CreditCard, Mail, Check, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: { title: string; price?: number };
  onPaymentSuccess: () => void;
}

export default function PaymentDialog({ 
  open, 
  onOpenChange, 
  event,
  onPaymentSuccess 
}: PaymentDialogProps) {
  const [step, setStep] = useState<'payment' | 'processing' | 'success'>('payment');
  const [email, setEmail] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [ticketId, setTicketId] = useState('');
  const price = event.price || 0;

  useEffect(() => {
    if (step === 'processing') {
      // Simulate payment processing
      setTimeout(async () => {
        const newTicketId = uuidv4();
        setTicketId(newTicketId);
        
        // Generate QR code
        const qrData = JSON.stringify({
          ticketId: newTicketId,
          event: event.title,
          date: new Date().toISOString(),
        });
        
        const qr = await QRCode.toDataURL(qrData, {
          width: 300,
          color: {
            dark: '#000000',
            light: '#9FE870',
          },
        });
        
        setQrCodeUrl(qr);
        setStep('success');
        
        onPaymentSuccess();
      }, 2500);
    }
  }, [step, event.title, onPaymentSuccess]);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
  };

  const downloadTicket = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `litbeam-ticket-${ticketId}.png`;
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {step === 'payment' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Complete Payment</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handlePayment} className="space-y-4 mt-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ticket Price</span>
                  <span className="text-2xl font-bold">₦{price.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email for Ticket Delivery</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="card">Card Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="card"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input
                    id="expiry"
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    maxLength={3}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-6 bg-black text-white hover:bg-gray-800 font-bold text-lg"
              >
                Pay ₦{price.toLocaleString()}
              </Button>
            </form>
          </>
        )}

        {step === 'processing' && (
          <div className="py-12 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="inline-block mb-4"
            >
              <Loader2 className="w-16 h-16 text-[#9FE870]" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Processing Payment</h3>
            <p className="text-gray-600">Please wait...</p>
          </div>
        )}

        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-20 h-20 bg-[#9FE870] rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Check className="w-10 h-10 text-black" strokeWidth={3} />
            </motion.div>
            
            <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-6">Your ticket has been sent to {email}</p>

            <div className="bg-white p-6 rounded-xl border-2 border-[#9FE870] mb-6">
              <img src={qrCodeUrl} alt="Ticket QR Code" className="w-full max-w-xs mx-auto" />
              <p className="text-sm text-gray-500 mt-4">Ticket ID: {ticketId.slice(0, 8)}</p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={downloadTicket}
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                Download Ticket
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="w-full"
              >
                Done
              </Button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}