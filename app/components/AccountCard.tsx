export default function AccountCard({ account }: any) {
  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      <h3 className="font-semibold text-lg">{account.name}</h3>
      <p className="text-sm text-gray-500">{account.contact}</p>

      <div className="mt-3 text-sm space-y-1">
        <p>Total Given: ₹{account.totalGiven}</p>
        <p>Total Taken: ₹{account.totalTaken}</p>
        <p className="font-medium">
          Outstanding: ₹{account.totalOutstanding}
        </p>
      </div>
    </div>
  );
}
