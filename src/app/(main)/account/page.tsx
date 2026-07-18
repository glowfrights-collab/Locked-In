import { getSessionUser } from "@/lib/session";
import {
  getSavedProductSummaries,
  getUnlockedProductSummaries,
  getDownloadHistory,
  getReferralsForUser,
} from "@/lib/account";
import { UnlockedList } from "@/components/account/UnlockedList";
import { DownloadHistoryList } from "@/components/account/DownloadHistoryList";
import { ReferralList } from "@/components/account/ReferralList";
import { SavedList } from "@/components/account/SavedList";
import { EmailSettingsForm } from "@/components/account/EmailSettingsForm";

export default async function AccountPage() {
  const user = await getSessionUser();

  const [unlocked, downloads, referrals, saved] = user
    ? await Promise.all([
        getUnlockedProductSummaries(user.id),
        getDownloadHistory(user.id),
        getReferralsForUser(user.id),
        getSavedProductSummaries(user.id),
      ])
    : [[], [], [], []];

  return (
    <div className="flex flex-col gap-8 px-4 py-4">
      <h1 className="text-xl font-semibold text-ink">Account</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-ink">Unlocked</h2>
        <UnlockedList products={unlocked} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-ink">Saved</h2>
        <SavedList products={saved} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-ink">Download history</h2>
        <DownloadHistoryList downloads={downloads} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-ink">Referrals</h2>
        <ReferralList referrals={referrals} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-ink">Email</h2>
        <EmailSettingsForm initialEmail={user?.email ?? null} />
      </section>
    </div>
  );
}
