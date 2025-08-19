import { getWalletForCurrentUser } from "@/lib/actions/wallet";
import ActivateWalletFlow from "@/Components/mandala-pay/ActivateWalletFlow";
import WalletDashboard from "@/Components/mandala-pay/WalletDashboard";
import { redirect } from 'next/navigation';
import { auth } from "@/auth";

export default async function MandalaPayPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }

  // Gọi server action để kiểm tra trạng thái ví
  const wallet = await getWalletForCurrentUser();

  return (
    <>
      {wallet ? (
        <WalletDashboard walletData={JSON.parse(JSON.stringify(wallet))} />
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
          <ActivateWalletFlow />
        </div>
      )}
    </>
  );
}
