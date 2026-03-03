// app/business/home/homeComponent/referral.tsx
// Consumes: referralSlice — getMyReferralCode, getMyReferrals, getReferralStats,
//           getBoostStatus, sendReferralSms

import Button from '@/components/form/Button';
import ModalComponent from '@/components/modal';
import NoRecord from '@/components/noRecord';
import {
    BoostLevel,
    ReferralItem,
    useGetBoostStatusQuery,
    useGetMyReferralCodeQuery,
    useGetMyReferralsQuery,
    useGetReferralStatsQuery,
    useSendReferralSmsMutation,
} from '@/redux/business/slices/referralSlice';
import { formatDate } from '@/utils/format';
import {
    CheckCircle2,
    Link2,
    MessageCircle,
    QrCode,
    Share2,
    Smartphone,
    Zap,
} from 'lucide-react-native';
import { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Keyboard,
    RefreshControl,
    ScrollView,
    Share,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

// ─── Tier config ──────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<
    BoostLevel,
    { label: string; bgClass: string; required: number; duration: string }
> = {
    none:   { label: 'No Boost',   bgClass: 'bg-gray-100 dark:bg-gray-800',        required: 0,  duration: '' },
    bronze: { label: 'Bronze 🥉',  bgClass: 'bg-orange-50 dark:bg-orange-900/20',  required: 1,  duration: '30 days' },
    silver: { label: 'Silver 🥈',  bgClass: 'bg-slate-100 dark:bg-slate-700/40',   required: 4,  duration: '60 days' },
    gold:   { label: 'Gold 🏆',    bgClass: 'bg-yellow-50 dark:bg-yellow-900/20',  required: 10, duration: '90 days' },
};

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string }> = {
    validated:       { label: 'Validated',        dot: 'bg-green-500',  text: 'text-green-700 dark:text-green-400' },
    pending:         { label: 'Pending',           dot: 'bg-yellow-400', text: 'text-yellow-700 dark:text-yellow-400' },
    profileComplete: { label: 'Profile Complete',  dot: 'bg-blue-500',   text: 'text-blue-700 dark:text-blue-400' },
    rejected:        { label: 'Rejected',          dot: 'bg-red-500',    text: 'text-red-700 dark:text-red-400' },
};

// ─── Boost progress bar ───────────────────────────────────────────────────────

const BoostProgressBar = ({
    validated,
    milestones,
}: {
    validated: number;
    milestones: { bronze: any; silver: any; gold: any };
}) => {
    const tiers = ['bronze', 'silver', 'gold'] as const;
    const GOLD_TARGET = TIER_CONFIG.gold.required; // 10
    const pct = Math.min((validated / GOLD_TARGET) * 100, 100);

    return (
        <View className="mt-2">
            {/* Tier icons + labels */}
            <View className="flex-row justify-between mb-3">
                {tiers.map((tier) => {
                    const cfg     = TIER_CONFIG[tier];
                    const reached = milestones[tier]?.reached ?? false;
                    return (
                        <View key={tier} className="items-center" style={{ width: '30%' }}>
                            <View
                                className={`w-10 h-10 rounded-full items-center justify-center mb-1.5 ${
                                    reached
                                        ? 'bg-yellow-400 dark:bg-yellow-500'
                                        : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                            >
                                <Zap size={16} color={reached ? '#000' : '#9ca3af'} />
                            </View>
                            <Text
                                className={`text-xs font-semibold text-center ${
                                    reached
                                        ? 'text-yellow-600 dark:text-yellow-400'
                                        : 'text-gray-400 dark:text-gray-500'
                                }`}
                            >
                                {cfg.label}
                            </Text>
                            <Text className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                                {cfg.required} ref{cfg.required !== 1 ? 's' : ''}
                            </Text>
                        </View>
                    );
                })}
            </View>
            {/* Track */}
            <View className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <View
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${pct}%` }}
                />
            </View>
            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 text-right">
                {validated} / {GOLD_TARGET} validated referrals
            </Text>
        </View>
    );
};

// ─── Referral row ─────────────────────────────────────────────────────────────

const ReferralRow = ({ item }: { item: ReferralItem }) => {
    const status = STATUS_CONFIG[item.status] ?? {
        label: item.status,
        dot: 'bg-gray-400',
        text: 'text-gray-600 dark:text-gray-400',
    };

    const ChannelIcon =
        item.channel === 'sms' ? (
            <Smartphone size={13} color="#9ca3af" />
        ) : (
            <Link2 size={13} color="#9ca3af" />
        );

    return (
        <View className="flex-row items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
            {/* Left: store info */}
            <View className="flex-1 mr-3">
                <Text
                    numberOfLines={1}
                    className="text-[15px] font-semibold text-gray-900 dark:text-white"
                >
                    {item.referred?.storeName ?? 'Unknown Store'}
                </Text>
                <View className="flex-row items-center mt-1 gap-1.5">
                    {ChannelIcon}
                    <Text className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                        via {item.channel}
                    </Text>
                    {item.referred?.address?.lga ? (
                        <Text className="text-xs text-gray-400 dark:text-gray-500">
                            · {item.referred.address.lga}
                        </Text>
                    ) : null}
                </View>
                {item.milestones?.registeredAt ? (
                    <Text className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                        Joined {formatDate(item.milestones.registeredAt)}
                    </Text>
                ) : null}
            </View>

            {/* Right: status + boost badge */}
            <View className="items-end shrink-0">
                <View className="flex-row items-center">
                    <View className={`w-2 h-2 rounded-full mr-1.5 ${status.dot}`} />
                    <Text className={`text-[13px] font-medium ${status.text}`}>
                        {status.label}
                    </Text>
                </View>
                {item.boostApplied ? (
                    <View className="flex-row items-center mt-1">
                        <Zap size={11} color="#f59e0b" />
                        <Text className="text-[11px] text-yellow-600 dark:text-yellow-400 ml-0.5 font-medium">
                            Boost applied
                        </Text>
                    </View>
                ) : null}
            </View>
        </View>
    );
};

// ─── Send SMS modal ───────────────────────────────────────────────────────────

const SendSmsModal = ({
    onClose,
    referralCode,
}: {
    onClose: () => void;
    referralCode: string;
}) => {
    const [phone, setPhone]        = useState('');
    const [error, setError]        = useState('');
    const [sent,  setSent]         = useState(false);
    const [sendSms, { isLoading }] = useSendReferralSmsMutation();

    const handleSend = async () => {
        Keyboard.dismiss();
        setError('');
        const raw        = phone.trim();
        const normalized = raw.startsWith('+')
            ? raw
            : `+234${raw.replace(/^0/, '')}`;
        if (normalized.replace(/\D/g, '').length < 10) {
            setError('Enter a valid phone number');
            return;
        }
        try {
            await sendSms({ phoneNumber: normalized }).unwrap();
            setSent(true);
        } catch (err: any) {
            setError(err?.data?.message ?? 'Failed to send SMS. Please try again.');
        }
    };

    if (sent) {
        return (
            <View className="p-5 items-center pb-8">
                <View className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full items-center justify-center mb-4">
                    <CheckCircle2 size={36} color="#22c55e" />
                </View>
                <Text className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                    SMS Sent!
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-center leading-6 mb-6">
                    Your referral invite has been delivered to{'\n'}
                    <Text className="font-semibold text-gray-700 dark:text-gray-200">{phone}</Text>
                </Text>
                <Button title="Done" onPress={onClose} className="w-full" />
            </View>
        );
    }

    return (
        <View className="p-5 pb-8">
            <View className="flex-row items-center mb-1">
                <MessageCircle size={20} color="#3b82f6" />
                <Text className="text-xl font-bold text-gray-900 dark:text-white ml-2">
                    Send Referral SMS
                </Text>
            </View>
            <Text className="text-gray-500 dark:text-gray-400 mb-5 leading-6 text-sm">
                Enter the phone number of the store owner you want to invite. Your code{' '}
                <Text className="font-bold text-gray-800 dark:text-gray-200">
                    {referralCode}
                </Text>{' '}
                will be included automatically. Max 5 SMS per day.
            </Text>

            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
            </Text>
            <TextInput
                value={phone}
                onChangeText={(t) => {
                    setPhone(t);
                    setError('');
                }}
                placeholder="+2348012345678"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                className="bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white text-base"
            />

            {error ? (
                <Text className="text-red-500 text-sm mt-2 mb-1">{error}</Text>
            ) : (
                <View className="mt-2 mb-1" />
            )}

            <Button
                title="Send SMS"
                isLoading={isLoading}
                loadingText="Sending…"
                onPress={handleSend}
                className="mt-3"
            />
            <Button
                title="Cancel"
                variant="outline"
                onPress={onClose}
                className="mt-3"
            />
        </View>
    );
};

// ─── QR code modal ────────────────────────────────────────────────────────────

const QrModal = ({ qrUrl, code }: { qrUrl: string; code: string }) => (
    <View className="p-5 pb-8 items-center">
        <View className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center mb-3">
            <QrCode size={22} color="#6b7280" />
        </View>
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Your QR Code
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-center text-sm mb-5 leading-5">
            Let other store owners scan this to join with your referral code
        </Text>
        <Image
            source={{ uri: qrUrl }}
            style={{ width: 208, height: 208 }}
            className="rounded-2xl"
            resizeMode="contain"
        />
        <Text
            className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-5"
            style={{ letterSpacing: 5 }}
        >
            {code}
        </Text>
    </View>
);

// ─── Share modal ──────────────────────────────────────────────────────────────

const ShareModal = ({
    code,
    link,
    onClose,
    onNativeShare,
}: {
    code: string;
    link: string;
    onClose: () => void;
    onNativeShare: () => void;
}) => (
    <View className="p-5 pb-8">
        <Text className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
            Refer & Earn a Boost
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-center mb-5 leading-6 text-sm">
            Share your code with other store owners. When they verify on Corisio, your
            boost level goes up — and so does your visibility.
        </Text>
        <View className="border border-dashed border-gray-300 dark:border-gray-600 rounded-2xl py-6 items-center mb-5">
            <Text className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-widest mb-2 uppercase">
                Referral Code
            </Text>
            <Text
                className="text-3xl font-bold text-gray-900 dark:text-white"
                style={{ letterSpacing: 5 }}
            >
                {code}
            </Text>
            <Text
                className="text-xs text-gray-400 dark:text-gray-500 mt-2"
                numberOfLines={1}
            >
                {link}
            </Text>
        </View>
        <TouchableOpacity
            onPress={() => {
                onClose();
                onNativeShare();
            }}
            className="bg-green-500 rounded-2xl py-4 items-center mb-3"
            activeOpacity={0.8}
        >
            <Text className="text-white font-semibold text-base">Share Now</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} className="items-center py-2">
            <Text className="text-gray-500 dark:text-gray-400 text-sm">Dismiss</Text>
        </TouchableOpacity>
    </View>
);

// ─── Main export ──────────────────────────────────────────────────────────────


export const summaryPills = [
        { key: 'total'           as const, label: 'Total',       bg: 'bg-gray-100 dark:bg-gray-700',        text: 'text-gray-700 dark:text-gray-200'    },
        { key: 'validated'       as const, label: 'Validated',   bg: 'bg-green-50 dark:bg-green-900/20',    text: 'text-green-700 dark:text-green-300'   },
        { key: 'pending'         as const, label: 'Pending',     bg: 'bg-yellow-50 dark:bg-yellow-900/20',  text: 'text-yellow-700 dark:text-yellow-300' },
        { key: 'profileComplete' as const, label: 'In Progress', bg: 'bg-blue-50 dark:bg-blue-900/20',      text: 'text-blue-700 dark:text-blue-300'     },
    ];

export default function ReferralScreen({
    shareReferral = false,
    setShare,
}: {
    shareReferral?: boolean;
    setShare: (v: boolean) => void;
}) {
    const isDark    = useColorScheme() === 'dark';
    const iconColor = isDark ? '#e5e7eb' : '#374151';

    const [smsModal, setSmsModal] = useState(false);
    const [qrModal,  setQrModal]  = useState(false);

    const { data: codeData,  isLoading: codeLoading,  refetch: refetchCode  } = useGetMyReferralCodeQuery();
    const { data: listData,  isLoading: listLoading,  refetch: refetchList  } = useGetMyReferralsQuery();
    const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useGetReferralStatsQuery();
    const { data: boostData, isLoading: boostLoading, refetch: refetchBoost } = useGetBoostStatusQuery();

    const codeInfo = codeData?.data;
    const listInfo = listData?.data;
    const stats    = statsData?.data;
    const boost    = boostData?.data;

    const isLoading    = codeLoading || listLoading || statsLoading || boostLoading;
    const isRefreshing = isLoading && !!codeInfo; // pull-to-refresh after initial load

    const refetchAll = () => {
        refetchCode();
        refetchList();
        refetchStats();
        refetchBoost();
    };

    const handleNativeShare = async () => {
        if (!codeInfo) return;
        await Share.share({
            message:
                `👋 Join me on Corisio — the fastest way for customers to find local stores!\n\n` +
                `Use my referral code *${codeInfo.referralCode}* when registering:\n\n` +
                `${codeInfo.shareableLink}`,
        });
    };

    const boostLevel = boost?.boost?.level ?? 'none';
    const tierCfg    = TIER_CONFIG[boostLevel];
    const hasList    = (listInfo?.referrals?.length ?? 0) > 0;

    

    return (
        <View className="flex-1">
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={refetchAll} />
                }
                showsVerticalScrollIndicator={false}
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* ── Initial loading ── */}
                {isLoading && !codeInfo ? (
                    <View className="items-center justify-center py-20">
                        <ActivityIndicator size="large" color="#f59e0b" />
                    </View>
                ) : (
                    <>
                        {/* ── Referral code card ── */}
                        {codeInfo && (
                            <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border border-gray-100 dark:border-gray-700">
                                <Text className="text-[11px] font-semibold tracking-widest text-gray-400 dark:text-gray-500 mb-1 uppercase">
                                    Your Referral Code
                                </Text>
                                <Text
                                    className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
                                    style={{ letterSpacing: 5 }}
                                >
                                    {codeInfo.referralCode}
                                </Text>

                                <View className="flex-row items-center gap-2">
                                    <TouchableOpacity
                                        onPress={handleNativeShare}
                                        activeOpacity={0.8}
                                        className="flex-1 flex-row items-center justify-center bg-yellow-400 py-3 rounded-full"
                                    >
                                        <Share2 size={16} color="#000" />
                                        <Text className="font-semibold text-black ml-2 text-sm">
                                            Share
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => setSmsModal(true)}
                                        activeOpacity={0.8}
                                        className="flex-1 flex-row items-center justify-center bg-blue-50 dark:bg-blue-900/20 py-3 rounded-full border border-blue-200 dark:border-blue-700"
                                    >
                                        <MessageCircle size={16} color="#3b82f6" />
                                        <Text className="font-semibold text-blue-600 dark:text-blue-400 ml-2 text-sm">
                                            Send SMS
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => setQrModal(true)}
                                        activeOpacity={0.8}
                                        className="w-12 h-12 items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full"
                                    >
                                        <QrCode size={18} color={iconColor} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* ── Boost status banner ── */}
                        {boost && (
                            <View className={`rounded-2xl p-4 mb-4 ${tierCfg.bgClass}`}>
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center flex-1">
                                        <Zap
                                            size={18}
                                            color={boostLevel === 'none' ? '#9ca3af' : '#f59e0b'}
                                        />
                                        <View className="ml-2 flex-1">
                                            <Text className="font-bold text-[15px] text-gray-800 dark:text-gray-100">
                                                {tierCfg.label} Boost
                                            </Text>
                                            {boost.isActive ? (
                                                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    Active · expires in {boost.daysRemaining} day
                                                    {boost.daysRemaining !== 1 ? 's' : ''}
                                                </Text>
                                            ) : boostLevel !== 'none' ? (
                                                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    Inactive
                                                </Text>
                                            ) : null}
                                        </View>
                                    </View>

                                    {boost.isActive && boost.daysRemaining > 0 && (
                                        <View className="bg-yellow-400 px-3 py-1 rounded-full ml-2">
                                            <Text className="text-xs font-bold text-black">
                                                {boost.daysRemaining}d left
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {boostLevel === 'none' && (
                                    <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-5">
                                        Refer just{' '}
                                        <Text className="font-semibold text-gray-700 dark:text-gray-300">
                                            1 verified store
                                        </Text>{' '}
                                        to unlock Bronze, 30 days of free boosted visibility.
                                    </Text>
                                )}
                            </View>
                        )}

                        {/* ── Boost progress ── */}
                        {stats && (
                            <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border border-gray-100 dark:border-gray-700">
                                <View className="flex-row items-center justify-between mb-1">
                                    <Text className="font-semibold text-[15px] text-gray-900 dark:text-white">
                                        Boost Progress
                                    </Text>
                                    {stats.progress.nextLevel ? (
                                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                                            {stats.progress.referralsToNext} more to{' '}
                                            <Text className="font-semibold capitalize">
                                                {stats.progress.nextLevel}
                                            </Text>
                                        </Text>
                                    ) : (
                                        <Text className="text-sm text-yellow-600 dark:text-yellow-400 font-semibold">
                                            Max level 🏆
                                        </Text>
                                    )}
                                </View>
                                <BoostProgressBar
                                    validated={stats.validatedReferrals}
                                    milestones={stats.milestones}
                                />
                            </View>
                        )}

                        {/* ── Summary pills ── */}
                        {listInfo?.summary && (
                            <View className="flex-row flex-wrap gap-2 mb-4">
                                {summaryPills.map(({ key, label, bg, text }) => (
                                    <View
                                        key={key}
                                        className={`flex-row items-center px-3 py-2 rounded-full ${bg}`}
                                    >
                                        <Text className={`text-sm font-bold mr-1 ${text}`}>
                                            {listInfo.summary[key]}
                                        </Text>
                                        <Text className={`text-sm ${text}`}>{label}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* ── Referral list ── */}
                        {hasList && (
                            <View className="bg-white dark:bg-gray-800 rounded-2xl px-4 border border-gray-100 dark:border-gray-700">
                                {listInfo!.referrals.map((item) => (
                                    <ReferralRow key={item._id} item={item} />
                                ))}
                            </View>
                        )
                        // ) : (
                        //     !isLoading && (
                        //         <View className="items-center py-10">
                        //             <NoRecord text=" " />
                        //             <Text className="text-gray-500 dark:text-gray-400 text-center mt-2 mb-5 leading-6">
                        //                 No referrals yet.{'\n'}Share your code to get started!
                        //             </Text>
                        //             <Button
                        //                 size="small"
                        //                 title="Share Your Code"
                        //                 className="rounded-full w-48"
                        //                 onPress={handleNativeShare}
                        //             />
                        //         </View>
                        //     )
                        // )}
                    }
                    </>
                )}
            </ScrollView>

            {/* ── Share modal (triggered by ShareReferral header button) ── */}
            <ModalComponent visible={shareReferral} onClose={() => setShare(false)}>
                {codeInfo && (
                    <ShareModal
                        code={codeInfo.referralCode}
                        link={codeInfo.shareableLink}
                        onClose={() => setShare(false)}
                        onNativeShare={handleNativeShare}
                    />
                )}
            </ModalComponent>

            {/* ── Send SMS modal ── */}
            <ModalComponent visible={smsModal} onClose={() => setSmsModal(false)}>
                <SendSmsModal
                    onClose={() => setSmsModal(false)}
                    referralCode={codeInfo?.referralCode ?? ''}
                />
            </ModalComponent>

            {/* ── QR code modal ── */}
            <ModalComponent visible={qrModal} onClose={() => setQrModal(false)}>
                {codeInfo && (
                    <QrModal qrUrl={codeInfo.qrCodeUrl} code={codeInfo.referralCode} />
                )}
            </ModalComponent>
        </View>
    );
}

// ─── Share button (used in home header) ──────────────────────────────────────

export const ShareReferral = ({ setShare }: { setShare: (v: boolean) => void }) => {
    const isDark = useColorScheme() === 'dark';
    return (
        <TouchableOpacity onPress={() => setShare(true)} hitSlop={8}>
            <Share2 size={20} color={isDark ? '#e5e7eb' : '#374151'} />
        </TouchableOpacity>
    );
};