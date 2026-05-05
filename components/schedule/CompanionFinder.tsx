// 원본 Index.tsx 1224~1702줄 1:1 (Afternoon block 전체 = 동행 찾기).
// localStorage 동기화: nt:companion-optin / nt:companion-profile / nt:companion-requested.
// myOptIn/profileSaved/profileData/requestedIds는 자체 hydrate (ScheduleTab의 props drilling 회피).
// savedIds만 ScheduleTab → props로 받아 일관 사용.

"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, DESTINATIONS } from "@/data/destinations";
import { ALL_COMPANIONS, type Companion } from "@/data/companions";
import {
  LS,
  readJson,
  readNumberSet,
  writeJson,
  writeNumberSet,
} from "@/lib/storage";
import { EMPTY_PROFILE, type CompanionProfile } from "@/lib/schedule";

const FONT = "'Noto Sans KR', sans-serif";

export function CompanionFinder({ savedIds }: { savedIds: Set<number> }) {
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // 영구 저장 상태
  const [myOptIn, setMyOptIn] = useState(false);
  const [profileData, setProfileData] = useState<CompanionProfile>(EMPTY_PROFILE);
  const [profileSaved, setProfileSaved] = useState(false);
  const [requestedIds, setRequestedIds] = useState<Set<number>>(new Set());

  // 휘발성 상태
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [searchedDestIds, setSearchedDestIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    setMyOptIn(readJson<boolean>(LS.companionOptin, false));
    const profile = readJson<CompanionProfile | null>(
      LS.companionProfile,
      null
    );
    if (profile) {
      setProfileData(profile);
      setProfileSaved(true);
    }
    setRequestedIds(readNumberSet(LS.companionRequested));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJson(LS.companionOptin, myOptIn);
  }, [myOptIn, hydrated]);
  useEffect(() => {
    if (hydrated) writeNumberSet(LS.companionRequested, requestedIds);
  }, [requestedIds, hydrated]);

  const savedDestinations = useMemo(
    () => DESTINATIONS.filter((d) => savedIds.has(d.id)),
    [savedIds]
  );

  const matchedCompanions = useMemo(() => {
    if (searchedDestIds.size === 0) return [];
    return ALL_COMPANIONS.filter(
      (comp) =>
        comp.isLookingForCompanion &&
        comp.destinationIds.some((dId) => searchedDestIds.has(dId))
    );
  }, [searchedDestIds]);

  const getShared = (comp: Companion) =>
    DESTINATIONS.filter(
      (d) => searchedDestIds.has(d.id) && comp.destinationIds.includes(d.id)
    );

  const toggleSearchDest = (id: number) =>
    setSearchedDestIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const handleRequest = (id: number) =>
    setRequestedIds((prev) => {
      const n = new Set(prev);
      n.add(id);
      return n;
    });

  const toggleInterest = (interest: string) =>
    setProfileData((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });

  const handleSaveProfile = () => {
    if (profileData.nickname.trim() && profileData.intro.trim()) {
      writeJson(LS.companionProfile, profileData);
      setProfileSaved(true);
      setShowProfileForm(false);
    }
  };

  const canSave = profileData.nickname.trim() && profileData.intro.trim();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full" style={{ background: "#E91E63" }} />
        <span className="text-lg">🌆</span>
        <span
          className="font-bold text-[15px]"
          style={{ color: "#2d2a26", fontFamily: FONT }}
        >
          오후
        </span>
        <span className="text-[13px]" style={{ color: "#8a8478", fontFamily: FONT }}>
          13:00 - 17:00
        </span>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between cursor-pointer border-none"
        style={{
          background: "#E91E6311",
          borderRadius: 12,
          padding: "14px 16px",
        }}
      >
        <span
          className="text-[13px] font-semibold"
          style={{ color: "#E91E63", fontFamily: FONT }}
        >
          🤝 관심사 동행 찾기{" "}
          {matchedCompanions.length > 0 ? `(${matchedCompanions.length}명)` : ""}
        </span>
        <span
          style={{
            color: "#E91E63",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
            display: "inline-block",
          }}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-3">
          {/* Opt-in toggle */}
          <div
            className="flex items-center justify-between"
            style={{
              background: myOptIn ? "#FFF3E0" : "#fff",
              borderRadius: 12,
              padding: "14px 16px",
              border: myOptIn ? "2px solid #FF6B35" : "2px solid #e8e3db",
              transition: "all 0.3s",
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{myOptIn ? "🟢" : "⚪"}</span>
              <div>
                <span
                  className="text-[13px] font-bold block"
                  style={{ color: "#2d2a26", fontFamily: FONT }}
                >
                  동행 찾기 참여하기
                </span>
                <span
                  className="text-[11px]"
                  style={{ color: "#8a8478", fontFamily: FONT }}
                >
                  {myOptIn
                    ? "참여 중 · 다른 여행자에게도 내 프로필이 보여요"
                    : "참여해야 동행을 찾을 수 있어요"}
                </span>
              </div>
            </div>
            <button
              onClick={() => setMyOptIn(!myOptIn)}
              className="border-none cursor-pointer text-[12px] font-bold px-4 py-2 rounded-full"
              style={{
                background: myOptIn ? "#FF6B35" : "#E91E63",
                color: "#fff",
                fontFamily: FONT,
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              {myOptIn ? "참여 중 ✓" : "참여하기"}
            </button>
          </div>

          {!myOptIn ? (
            <div
              className="flex flex-col items-center gap-2 py-6"
              style={{
                background: "#fff",
                borderRadius: 14,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <span className="text-3xl">🔒</span>
              <p
                className="text-[13px] font-semibold"
                style={{ color: "#5a5346", fontFamily: FONT }}
              >
                동행 찾기에 참여해주세요
              </p>
              <p
                className="text-[11px] text-center"
                style={{ color: "#8a8478", fontFamily: FONT }}
              >
                위의 &ldquo;참여하기&rdquo; 버튼을 눌러야
                <br />
                동행 찾기를 이용할 수 있어요
              </p>
            </div>
          ) : (
            <>
              {!profileSaved && !showProfileForm && (
                <button
                  onClick={() => setShowProfileForm(true)}
                  className="w-full flex items-center justify-center gap-2 cursor-pointer border-none"
                  style={{
                    background: "linear-gradient(135deg, #E91E63, #FF6B35)",
                    borderRadius: 12,
                    padding: "14px 16px",
                    color: "#fff",
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  ✍️ 내 동행 프로필 등록하기
                </button>
              )}

              {profileSaved && (
                <div
                  className="flex items-center gap-2"
                  style={{
                    background: "#E8F5E9",
                    borderRadius: 12,
                    padding: "12px 16px",
                  }}
                >
                  <span className="text-lg">✅</span>
                  <div className="flex-1">
                    <span
                      className="text-[13px] font-bold"
                      style={{ color: "#2E7D32", fontFamily: FONT }}
                    >
                      프로필 등록 완료!
                    </span>
                    <span
                      className="text-[11px] ml-2"
                      style={{ color: "#4CAF50", fontFamily: FONT }}
                    >
                      동행 요청을 기다리고 있어요
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileForm(true);
                      setProfileSaved(false);
                    }}
                    className="border-none cursor-pointer text-[11px] font-semibold"
                    style={{
                      background: "transparent",
                      color: "#2E7D32",
                      fontFamily: FONT,
                    }}
                  >
                    수정
                  </button>
                </div>
              )}

              {showProfileForm && (
                <div
                  className="bg-white flex flex-col gap-3"
                  style={{
                    borderRadius: 14,
                    padding: 16,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <span
                    className="font-bold text-[15px]"
                    style={{ color: "#2d2a26", fontFamily: FONT }}
                  >
                    ✍️ 내 동행 프로필
                  </span>
                  <div>
                    <label
                      className="text-[12px] font-semibold mb-1 block"
                      style={{ color: "#5a5346", fontFamily: FONT }}
                    >
                      닉네임
                    </label>
                    <input
                      type="text"
                      placeholder="예: 여행하는 판다 🐼"
                      value={profileData.nickname}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          nickname: e.target.value,
                        })
                      }
                      className="w-full border-none outline-none text-[13px]"
                      style={{
                        background: "#f5f0e8",
                        borderRadius: 10,
                        padding: "10px 12px",
                        fontFamily: FONT,
                        color: "#2d2a26",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="text-[12px] font-semibold mb-1.5 block"
                      style={{ color: "#5a5346", fontFamily: FONT }}
                    >
                      관심 카테고리
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                        <button
                          key={c.id}
                          onClick={() => toggleInterest(c.label)}
                          className="border-none cursor-pointer text-[11px] font-semibold px-2.5 py-1.5 rounded-full"
                          style={{
                            background: profileData.interests.includes(c.label)
                              ? c.color
                              : "#f0ece6",
                            color: profileData.interests.includes(c.label)
                              ? "#fff"
                              : "#5a5346",
                            fontFamily: FONT,
                            transition: "all 0.2s",
                          }}
                        >
                          {c.emoji} {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label
                      className="text-[12px] font-semibold mb-1 block"
                      style={{ color: "#5a5346", fontFamily: FONT }}
                    >
                      여행 스타일
                    </label>
                    <input
                      type="text"
                      placeholder="예: 느긋한 힐링 여행파"
                      value={profileData.style}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          style: e.target.value,
                        })
                      }
                      className="w-full border-none outline-none text-[13px]"
                      style={{
                        background: "#f5f0e8",
                        borderRadius: 10,
                        padding: "10px 12px",
                        fontFamily: FONT,
                        color: "#2d2a26",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="text-[12px] font-semibold mb-1 block"
                      style={{ color: "#5a5346", fontFamily: FONT }}
                    >
                      한줄 소개
                    </label>
                    <textarea
                      placeholder="동행에게 하고 싶은 말을 적어주세요!"
                      value={profileData.intro}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          intro: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full border-none outline-none text-[13px] resize-none"
                      style={{
                        background: "#f5f0e8",
                        borderRadius: 10,
                        padding: "10px 12px",
                        fontFamily: FONT,
                        color: "#2d2a26",
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowProfileForm(false)}
                      className="flex-1 border-none cursor-pointer text-[13px] font-semibold py-2.5"
                      style={{
                        background: "#f0ece6",
                        borderRadius: 10,
                        color: "#5a5346",
                        fontFamily: FONT,
                      }}
                    >
                      취소
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 border-none cursor-pointer text-[13px] font-semibold py-2.5"
                      style={{
                        background: canSave
                          ? "linear-gradient(135deg, #E91E63, #FF6B35)"
                          : "#e0dbd3",
                        borderRadius: 10,
                        color: canSave ? "#fff" : "#8a8478",
                        fontFamily: FONT,
                      }}
                    >
                      등록하기
                    </button>
                  </div>
                </div>
              )}

              {savedIds.size === 0 ? (
                <div
                  className="flex flex-col items-center gap-2 py-6"
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <span className="text-3xl">🤝</span>
                  <p
                    className="text-[13px] font-semibold"
                    style={{ color: "#5a5346", fontFamily: FONT }}
                  >
                    저장된 여행지가 없어요
                  </p>
                  <p
                    className="text-[11px] text-center"
                    style={{ color: "#8a8478", fontFamily: FONT }}
                  >
                    탐색 탭에서 여행지를 저장하면
                    <br />
                    같은 여행지에 관심 있는 동행을 찾아드려요
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className="bg-white"
                    style={{
                      borderRadius: 14,
                      padding: 14,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <span
                      className="text-[12px] font-semibold block mb-2"
                      style={{ color: "#5a5346", fontFamily: FONT }}
                    >
                      📍 동행을 찾을 여행지를 선택하세요
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {savedDestinations.map((dest) => {
                        const isSearched = searchedDestIds.has(dest.id);
                        const catObj = CATEGORIES.find(
                          (c) => c.id === dest.cat
                        )!;
                        return (
                          <button
                            key={dest.id}
                            onClick={() => toggleSearchDest(dest.id)}
                            className="border-none cursor-pointer text-[11px] font-semibold px-2.5 py-1.5 rounded-full"
                            style={{
                              background: isSearched
                                ? catObj.color
                                : "#f0ece6",
                              color: isSearched ? "#fff" : "#5a5346",
                              fontFamily: FONT,
                              transition: "all 0.2s",
                            }}
                          >
                            {isSearched ? "✓ " : ""}
                            {catObj.emoji} {dest.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {searchedDestIds.size === 0 ? (
                    <div
                      className="flex flex-col items-center gap-2 py-4"
                      style={{
                        background: "#fff",
                        borderRadius: 14,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      }}
                    >
                      <span className="text-2xl">👆</span>
                      <p
                        className="text-[12px] text-center"
                        style={{ color: "#8a8478", fontFamily: FONT }}
                      >
                        위에서 여행지를 선택하면
                        <br />
                        해당 여행지의 동행을 찾아드려요
                      </p>
                    </div>
                  ) : matchedCompanions.length === 0 ? (
                    <div
                      className="flex flex-col items-center gap-2 py-4"
                      style={{
                        background: "#fff",
                        borderRadius: 14,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      }}
                    >
                      <span className="text-2xl">😢</span>
                      <p
                        className="text-[13px] font-semibold"
                        style={{ color: "#5a5346", fontFamily: FONT }}
                      >
                        아직 매칭되는 동행이 없어요
                      </p>
                      <p
                        className="text-[11px] text-center"
                        style={{ color: "#8a8478", fontFamily: FONT }}
                      >
                        다른 여행지를 선택해보세요!
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className="text-[13px] font-bold"
                        style={{ color: "#2d2a26", fontFamily: FONT }}
                      >
                        🧳 선택한 여행지의 동행 여행자
                      </span>
                      <span
                        className="text-[11px]"
                        style={{ color: "#8a8478", fontFamily: FONT }}
                      >
                        ({matchedCompanions.length}명)
                      </span>
                    </div>
                  )}

                  {matchedCompanions.map((comp) => {
                    const shared = getShared(comp);
                    return (
                      <div
                        key={comp.id}
                        className="bg-white"
                        style={{
                          borderRadius: 14,
                          padding: 16,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}
                      >
                        <div className="flex items-center gap-3 mb-2.5">
                          <div
                            className="flex items-center justify-center text-2xl"
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 22,
                              background: comp.color + "15",
                            }}
                          >
                            {comp.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="font-bold text-[14px]"
                                style={{
                                  color: "#2d2a26",
                                  fontFamily: FONT,
                                }}
                              >
                                {comp.nickname}
                              </span>
                              <span
                                className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
                                style={{
                                  background: "#4CAF5022",
                                  color: "#4CAF50",
                                  fontFamily: FONT,
                                }}
                              >
                                동행 찾는 중
                              </span>
                            </div>
                            <div
                              className="text-[11px]"
                              style={{ color: "#8a8478", fontFamily: FONT }}
                            >
                              {comp.style}
                            </div>
                          </div>
                        </div>

                        <div className="mb-2">
                          <span
                            className="text-[10px] font-semibold"
                            style={{ color: "#8a8478", fontFamily: FONT }}
                          >
                            📍 함께 갈 수 있는 여행지:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {shared.map((sd) => (
                              <span
                                key={sd.id}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                style={{
                                  background: "#FF6B3518",
                                  color: "#FF6B35",
                                  fontFamily: FONT,
                                }}
                              >
                                {sd.title}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                          {comp.interests.map((interest) => {
                            const cat = CATEGORIES.find(
                              (c) => c.label === interest
                            );
                            return (
                              <span
                                key={interest}
                                className="text-[10px] font-semibold px-2 py-1 rounded-full"
                                style={{
                                  background: (cat?.color || "#8a8478") + "18",
                                  color: cat?.color || "#8a8478",
                                  fontFamily: FONT,
                                }}
                              >
                                {cat?.emoji} {interest}
                              </span>
                            );
                          })}
                        </div>
                        <p
                          className="text-[12px] leading-relaxed mb-3"
                          style={{ color: "#5a5346", fontFamily: FONT }}
                        >
                          &ldquo;{comp.intro}&rdquo;
                        </p>
                        <button
                          onClick={() => handleRequest(comp.id)}
                          disabled={requestedIds.has(comp.id)}
                          className="w-full border-none cursor-pointer text-[13px] font-semibold py-2.5"
                          style={{
                            background: requestedIds.has(comp.id)
                              ? "#f0ece6"
                              : comp.color + "15",
                            borderRadius: 10,
                            color: requestedIds.has(comp.id)
                              ? "#8a8478"
                              : comp.color,
                            fontFamily: FONT,
                            transition: "all 0.2s",
                          }}
                        >
                          {requestedIds.has(comp.id)
                            ? "✅ 동행 신청 완료!"
                            : "🤝 동행 신청하기"}
                        </button>
                      </div>
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>
      )}

      <div className="flex justify-center my-4">
        <span
          className="text-xs"
          style={{
            background: "#f5f0e8",
            padding: "6px 14px",
            borderRadius: 12,
            color: "#8a8478",
            fontFamily: FONT,
          }}
        >
          🌃 자유 시간
        </span>
      </div>
    </div>
  );
}
