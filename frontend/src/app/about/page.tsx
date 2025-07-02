'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Users, Target, Award, Shield, MapPin, Mail, Phone, Globe } from 'lucide-react';
import { aboutAPI, apiUtils } from '../../lib/api';

// 인터페이스 정의
interface CompanyStatistics {
  adoptions: number;
  families: number;
  shelters: number;
  support: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  expertise: string;
  profileImage?: string;
}

interface HistoryMilestone {
  id: string;
  date: string;
  title: string;
  description: string;
}

interface CompanyInfo {
  mission: string;
  vision: string;
  values: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  contact: {
    address: string;
    phone: string;
    email: string;
    website: string;
  };
}

// 회사소개 페이지 컴포넌트
export default function AboutPage() {
  // State management
  const [statistics, setStatistics] = useState<CompanyStatistics>({
    adoptions: 500,
    families: 1200,
    shelters: 50,
    support: '24/7'
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [history, setHistory] = useState<HistoryMilestone[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Load about page data
  useEffect(() => {
    const loadAboutData = async () => {
      try {
        setLoading(true);
        
        // Load all about data in parallel
        const [statsResponse, teamResponse, historyResponse, companyResponse] = await Promise.all([
          aboutAPI.getStatistics(),
          aboutAPI.getTeamMembers(),
          aboutAPI.getHistory(),
          aboutAPI.getCompanyInfo()
        ]);

        // Update statistics
        if (apiUtils.isSuccess(statsResponse)) {
          const statsData = apiUtils.getData(statsResponse);
          setStatistics(statsData);
        }

        // Update team members
        if (apiUtils.isSuccess(teamResponse)) {
          const teamData = apiUtils.getData(teamResponse) || [];
          setTeamMembers(teamData);
        } else {
          setTeamMembers([]);
        }

        // Update history
        if (apiUtils.isSuccess(historyResponse)) {
          const historyData = apiUtils.getData(historyResponse) || [];
          setHistory(historyData);
        } else {
          setHistory([]);
        }

        // Update company info
        if (apiUtils.isSuccess(companyResponse)) {
          const companyData = apiUtils.getData(companyResponse);
          setCompanyInfo(companyData);
        }

      } catch (error) {
        console.error('Failed to load about data:', error);
        
        // Set empty data on error
        setTeamMembers([]);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    loadAboutData();
  }, []);


  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16">
            {/* 뒤로가기 버튼 */}
            <Link 
              href="/" 
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            
            {/* 로고 */}
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-gray-900">Companion Animals</span>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* 히어로 섹션 */}
        <section className="py-20" style={{
          background: 'linear-gradient(135deg, #FFE2D2 0%, #FFF1AA 50%, #E3EFF9 100%)'
        }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                우리는 <span className="text-orange-500">동물과 사람</span>을
                <br />
                연결하는 다리입니다
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                길잃은 동물들이 따뜻한 가정을 찾을 수 있도록,
                <br />
                그리고 더 많은 사람들이 생명의 소중함을 느낄 수 있도록
                <br />
                Companion Animals가 함께합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 미션 & 비전 */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">우리의 미션</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 rounded-full p-3 flex-shrink-0">
                      <Heart className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">생명 존중</h3>
                      <p className="text-gray-600">
                        모든 동물의 생명을 소중히 여기고, 그들이 행복하게 살 수 있는 환경을 만들어갑니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                      <Users className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">연결의 가치</h3>
                      <p className="text-gray-600">
                        동물과 사람, 사람과 사람을 이어주는 따뜻한 연결고리 역할을 합니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 rounded-full p-3 flex-shrink-0">
                      <Shield className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">책임감 있는 입양</h3>
                      <p className="text-gray-600">
                        신중하고 책임감 있는 입양 문화를 만들어 동물과 가족 모두가 행복할 수 있도록 돕습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-3xl p-8">
                {loading ? (
                  <div className="grid grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="text-center">
                        <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mx-auto"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-500 mb-2">{statistics.adoptions}+</div>
                      <div className="text-gray-600 text-sm">성공한 입양</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-500 mb-2">{statistics.families.toLocaleString()}+</div>
                      <div className="text-gray-600 text-sm">행복한 가족</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-500 mb-2">{statistics.shelters}+</div>
                      <div className="text-gray-600 text-sm">협력 보호소</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-500 mb-2">{statistics.support}</div>
                      <div className="text-gray-600 text-sm">상담 지원</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 우리의 가치 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">우리의 가치</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Companion Animals가 추구하는 핵심 가치들입니다
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Heart className="h-8 w-8 text-orange-500" />,
                  title: "사랑과 돌봄",
                  description: "모든 생명을 사랑하고 보살피는 마음으로 서비스를 제공합니다."
                },
                {
                  icon: <Shield className="h-8 w-8 text-blue-500" />,
                  title: "신뢰와 안전",
                  description: "투명하고 안전한 입양 과정을 통해 신뢰를 쌓아갑니다."
                },
                {
                  icon: <Users className="h-8 w-8 text-green-500" />,
                  title: "공동체 의식",
                  description: "함께 만들어가는 따뜻한 반려동물 공동체를 지향합니다."
                },
                {
                  icon: <Target className="h-8 w-8 text-purple-500" />,
                  title: "지속적 개선",
                  description: "더 나은 서비스를 위해 끊임없이 개선하고 발전합니다."
                }
              ].map((value, index) => (
                <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 팀 소개 */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">우리팀을 소개합니다</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                동물을 사랑하는 마음으로 모인 전문가들이 함께 만들어가는 서비스입니다
              </p>
            </div>
            
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="bg-gray-200 rounded-full w-20 h-20 mx-auto mb-4 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-2/3 mx-auto"></div>
                    <div className="h-16 bg-gray-200 rounded animate-pulse mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded-full animate-pulse w-1/2 mx-auto"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member) => (
                  <div key={member.id} className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="bg-orange-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                      {member.profileImage ? (
                        <img 
                          src={apiUtils.getImageUrl(member.profileImage)}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <Users className={`h-10 w-10 text-orange-500 ${member.profileImage ? 'hidden' : ''}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-orange-500 font-medium text-sm mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">{member.description}</p>
                    <div className="text-xs text-gray-500 bg-white rounded-full px-3 py-1 inline-block">
                      {member.expertise}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 연혁 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">회사 연혁</h2>
              <p className="text-gray-600">
                Companion Animals의 성장 과정을 소개합니다
              </p>
            </div>
            
            <div className="relative">
              {/* 타임라인 라인 */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-orange-200 transform md:-translate-x-0.5"></div>
              
              {loading ? (
                <div className="space-y-8">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      {/* 타임라인 포인트 */}
                      <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-gray-300 rounded-full transform md:-translate-x-1.5 md:-translate-y-0.5 z-10 animate-pulse"></div>
                      
                      {/* 컨텐츠 */}
                      <div className={`bg-white rounded-xl p-6 shadow-sm ml-12 md:ml-0 ${index % 2 === 0 ? 'md:mr-8 md:ml-0 md:w-5/12' : 'md:ml-8 md:mr-0 md:w-5/12'}`}>
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/3"></div>
                        <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {history.map((milestone, index) => (
                    <div key={milestone.id} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      {/* 타임라인 포인트 */}
                      <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-orange-500 rounded-full transform md:-translate-x-1.5 md:-translate-y-0.5 z-10"></div>
                      
                      {/* 컨텐츠 */}
                      <div className={`bg-white rounded-xl p-6 shadow-sm ml-12 md:ml-0 ${index % 2 === 0 ? 'md:mr-8 md:ml-0 md:w-5/12' : 'md:ml-8 md:mr-0 md:w-5/12'}`}>
                        <div className="text-orange-500 font-semibold text-sm mb-2">{milestone.date}</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 연락처 정보 */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">연락처</h2>
              <p className="text-gray-600">
                궁금한 점이 있으시면 언제든 연락해주세요
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">주소</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  서울시 강남구 테헤란로 123
                  <br />
                  컴패니언 빌딩 5층
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">전화</h3>
                <p className="text-gray-600 text-sm">
                  02-1234-5678
                  <br />
                  <span className="text-xs">(평일 9시~18시)</span>
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">이메일</h3>
                <p className="text-gray-600 text-sm">
                  info@companionanimals.com
                  <br />
                  <span className="text-xs">(24시간 접수)</span>
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">웹사이트</h3>
                <p className="text-gray-600 text-sm">
                  www.companionanimals.com
                  <br />
                  <span className="text-xs">(24시간 이용 가능)</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="py-16" style={{ backgroundColor: '#FFF1AA' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              함께 만들어가요
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              더 많은 동물들이 행복한 가정을 찾을 수 있도록
              <br />
              Companion Animals와 함께해주세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pets"
                className="bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-all transform hover:scale-105 shadow-lg"
              >
                분양동물 보기
              </Link>
              <Link
                href="/contact"
                className="bg-white text-orange-500 border-2 border-orange-500 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-all"
              >
                문의하기
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}