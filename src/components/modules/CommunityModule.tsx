import React, { useState } from 'react';
import {
  Users,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  PlusCircle,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { CommunityPost, CommunityGroup } from '../../types';
import { usePlatform } from '../../context/PlatformContext';
import { useAuth } from '../../context/AuthContext';

export const CommunityModule: React.FC = () => {
  const { currentUser } = useAuth();
  const { communityPosts, communityGroups, addCommunityPost, toggleLikePost, joinGroup } = usePlatform();

  const [activeSubTab, setActiveSubTab] = useState<'feed' | 'groups' | 'businesses'>('feed');
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState('');
  const [postTag, setPostTag] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const tags = postTag.trim()
      ? postTag.split(',').map((t) => t.trim().replace(/^#/, ''))
      : ['NEXORA'];

    const images = postImage.trim() ? [postImage.trim()] : undefined;

    addCommunityPost(postContent.trim(), images, tags);
    setPostContent('');
    setPostImage('');
    setPostTag('');
  };

  const handleAiEnhancePost = async () => {
    if (!postContent.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Ushbu ijtimoiy tarmoq postini yanada jozibador, professional va formatlangan qilib sayqallang (emojilar va teglar bilan): "${postContent}"`,
          systemRole: 'general',
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setPostContent(data.reply);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            NEXORA COMMUNITY — Global Hamjamiyat
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Xalqaro eksportchilar, frilanserlar, transport operatorlari va tadbirkorlar ochiq ijtimoiy ekotizimi.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold">
          {[
            { id: 'feed', label: 'Bosh Lenta (Feed)' },
            { id: 'groups', label: `Guruhlar (${communityGroups.length})` },
            { id: 'businesses', label: 'Biznes Sahifalari' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeSubTab === tab.id
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Feed or Groups */}
      {activeSubTab === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Feed (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Create Post Box */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-700"
                />
                <input
                  type="text"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Xalqaro hamjamiyat bilan nima yangilik ulashmoqchisiz?..."
                  className="flex-1 px-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              {postContent.trim() && (
                <div className="space-y-2 pt-1 animate-fade-in text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="url"
                      value={postImage}
                      onChange={(e) => setPostImage(e.target.value)}
                      placeholder="Rasm havolasi (URL)..."
                      className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs"
                    />
                    <input
                      type="text"
                      value={postTag}
                      onChange={(e) => setPostTag(e.target.value)}
                      placeholder="Teglar: Export, Logistics, AI..."
                      className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={handleAiEnhancePost}
                  disabled={isEnhancing || !postContent.trim()}
                  className="text-purple-400 hover:text-purple-300 font-semibold text-xs flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isEnhancing ? 'Sayqallanmoqda...' : 'NEXORA AI bilan boyitish'}
                </button>

                <button
                  onClick={handleCreatePost}
                  disabled={!postContent.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition disabled:opacity-40 shadow"
                >
                  Postni Joylashtirish (+25 ball)
                </button>
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5 text-xs text-slate-200"
                >
                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                          {post.authorName}
                          <span className="text-slate-400 font-mono text-[11px]">{post.authorUsername}</span>
                          {post.authorIsBusiness && (
                            <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 text-[10px] font-bold">
                              Biznes
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{post.createdAt}</div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="leading-relaxed text-[13px] text-slate-200">
                    {post.content}
                  </p>

                  {/* Image attachment */}
                  {post.images && post.images.length > 0 && (
                    <div className="rounded-xl overflow-hidden border border-slate-800 max-h-80 bg-black">
                      <img
                        src={post.images[0]}
                        alt="Post media"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-purple-400 font-mono text-[11px] hover:underline cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Interaction bar */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <button
                      onClick={() => toggleLikePost(post.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition ${
                        post.likedByMe
                          ? 'text-rose-400 bg-rose-950/40 font-bold'
                          : 'hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.likedByMe ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{post.likesCount}</span>
                    </button>

                    <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:text-slate-200 hover:bg-slate-800 transition">
                      <MessageCircle className="w-4 h-4 text-slate-400" />
                      <span>{post.commentsCount} Sharh</span>
                    </button>

                    <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:text-slate-200 hover:bg-slate-800 transition">
                      <Share2 className="w-4 h-4 text-slate-400" />
                      <span>{post.sharesCount} Ulashish</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar: Recommended Groups & Trending (4 cols) */}
          <div className="lg:col-span-4 space-y-4 text-xs">
            {/* Active Groups Widget */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                Ommabop Hamjamiyatlar
              </h3>
              <div className="space-y-2.5">
                {communityGroups.map((grp) => (
                  <div
                    key={grp.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={grp.avatar}
                        alt={grp.name}
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-200 truncate">{grp.name}</div>
                        <div className="text-[10px] text-slate-400">{grp.membersCount} a'zo</div>
                      </div>
                    </div>
                    <button
                      onClick={() => joinGroup(grp.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition ${
                        grp.isJoined
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-purple-600 text-white hover:bg-purple-500 shadow'
                      }`}
                    >
                      {grp.isJoined ? "A'zo" : "Qo‘shilish"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending tags */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
              <h3 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                Kun Trendlari
              </h3>
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                {['#GlobalTrade', '#SilkRoadCargo', '#NextGenEcommerce', '#EscrowTrust', '#WebRTC_Calls', '#FreelancersUz'].map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-purple-300 hover:bg-slate-700 cursor-pointer">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Groups full view */}
      {activeSubTab === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {communityGroups.map((grp) => (
            <div
              key={grp.id}
              className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden space-y-3 p-5 text-xs"
            >
              <div className="flex items-center gap-3">
                <img src={grp.avatar} alt={grp.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">{grp.name}</h3>
                  <span className="text-slate-400 text-[11px]">{grp.category} • {grp.membersCount} a'zo</span>
                </div>
              </div>
              <p className="text-slate-300 text-[12px] leading-relaxed">{grp.description}</p>
              <button
                onClick={() => joinGroup(grp.id)}
                className={`w-full py-2 rounded-xl text-xs font-semibold transition ${
                  grp.isJoined
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-purple-600 text-white hover:bg-purple-500 shadow'
                }`}
              >
                {grp.isJoined ? "Siz guruh a'zosisiz" : "Guruhga Qo‘shilish"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Business Pages */}
      {activeSubTab === 'businesses' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-amber-400" />
              <div>
                <h3 className="font-bold text-slate-100 text-sm">SilkRoad Global Commerce LLC</h3>
                <span className="text-slate-400">Rasmiy Eksport-Import Korxonasi</span>
              </div>
            </div>
            <p className="text-slate-300">
              Xitoy, BAA va Yevropa mamlakatlaridan yuqori sifatli elektronika, dasturiy ta'minot va to‘qimachilik mahsulotlari ulgurji ta'minoti.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-cyan-400" />
              <div>
                <h3 className="font-bold text-slate-100 text-sm">TransEurasia Logistics Group</h3>
                <span className="text-slate-400">Xalqaro Avia va Temiryo‘l Tashuvchisi</span>
              </div>
            </div>
            <p className="text-slate-300">
              Yevroosiyo qit'asi bo‘ylab multimodal yuk tashish, bojxona rasmiylashtiruvi va eshikdan-eshikkacha kuryerlik tarmog‘i.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
