import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet } from "lucide-react";

interface PaymentSelectionProps {
  amount: number;
  onPaymentSelect: (method: "cash" | "online") => void;
  selectedMethod?: "cash" | "online";
}

export const PaymentSelection = ({ amount, onPaymentSelect, selectedMethod }: PaymentSelectionProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">Payment Method</h3>
      
      <RadioGroup value={selectedMethod} onValueChange={(value) => onPaymentSelect(value as "cash" | "online")}>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 border rounded-lg p-4 hover:border-primary transition-colors">
            <RadioGroupItem value="online" id="online" />
            <Label htmlFor="online" className="flex items-center gap-3 cursor-pointer flex-1">
              <CreditCard className="w-5 h-5" />
              <div>
                <div className="font-medium">Pay Online</div>
                <div className="text-sm text-muted-foreground">Secure payment via Stripe</div>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-3 border rounded-lg p-4 hover:border-primary transition-colors">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash" className="flex items-center gap-3 cursor-pointer flex-1">
              <Wallet className="w-5 h-5" />
              <div>
                <div className="font-medium">Pay at Hospital</div>
                <div className="text-sm text-muted-foreground">Pay cash at the clinic</div>
              </div>
            </Label>
          </div>
        </div>
      </RadioGroup>

      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total Amount:</span>
          <span className="text-primary">${amount}</span>
        </div>
      </div>
    </Card>
  );
};