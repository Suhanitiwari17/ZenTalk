import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { X, Globe, Shield, Megaphone, UserPlus } from 'lucide-react';
import UserAvatar from '@/components/ui/user-avatar';

const ICONS = ['🌐', '🏢', '🎓', '🎮', '🎨', '🚀', '💼', '🌍', '🏆', '📚', '🎵', '💡', '🔬', '🌱', '⚡'];

const ROLE_PRESETS = [
  {
    id: 'default',
    label: 'Default',
    labels: { owner: 'Owner', admin: 'Admin', moderator: 'Moderator', member: 'Member' },
  },
  {
    id: 'college',
    label: 'College',
    labels: { owner: 'Department Head', admin: 'Teacher', moderator: 'Class Coordinator', member: 'Student' },
  },
  {
    id: 'company',
    label: 'Company',
    labels: { owner: 'Director', admin: 'Manager', moderator: 'Lead', member: 'Staff' },
  },
];

export default function CreateCommunityModal() {
  const { createCommunity, setShowCreateCommunity, allUsers, currentUser, setSidebarTab } = useApp();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🌐');
  const [description, setDescription] = useState('');
  const [adminsOnlyMessages, setAdminsOnlyMessages] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [roleLabels, setRoleLabels] = useState({
    owner: 'Owner',
    admin: 'Admin',
    moderator: 'Moderator',
    member: 'Member',
  });
  const [error, setError] = useState('');

  const handlePreset = (presetId: string) => {
    const preset = ROLE_PRESETS.find(item => item.id === presetId);
    if (!preset) return;
    setRoleLabels(preset.labels);
  };

  const handleCreate = () => {
    if (!name.trim()) { setError('Please enter a community name'); return; }
    setError('');
    createCommunity(name.trim(), icon, description, { roleLabels, adminsOnlyMessages, memberIds: selectedMembers });
    setSidebarTab('communities');
    setShowCreateCommunity(false);
  };

  const selectableUsers = allUsers.filter(user => user.id !== currentUser?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-bold text-foreground text-lg">New Community</h2>
          <button onClick={() => setShowCreateCommunity(false)}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>}

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Community Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(i => (
                <button type="button" key={i} onClick={() => setIcon(i)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                    icon === i ? 'bg-primary/20 ring-2 ring-primary scale-110' : 'bg-muted hover:bg-muted/80'
                  }`}>
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Community Name *</label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="Enter community name"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</label>
              <input value={description} onChange={e => setDescription(e.target.value)}
                placeholder="What's this community about?"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Role Naming</p>
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              {ROLE_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePreset(preset.id)}
                  className="rounded-xl border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {(['owner', 'admin', 'moderator', 'member'] as const).map(role => (
                <div key={role}>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{role}</label>
                  <input
                    value={roleLabels[role]}
                    onChange={e => setRoleLabels(prev => ({ ...prev, [role]: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Admins Only Messaging</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Start this community in announcement mode so only elevated roles can send messages.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdminsOnlyMessages(prev => !prev)}
                className={`relative h-6 w-10 rounded-full transition-colors ${adminsOnlyMessages ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              >
                <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${adminsOnlyMessages ? 'translate-x-[0.9rem]' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Initial Members</p>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              Add people while creating the community so the owner can assign roles and permissions right away.
            </p>
            <div className="max-h-44 space-y-1 overflow-y-auto rounded-xl border border-border bg-background p-2">
              {selectableUsers.map(user => (
                <label key={user.id} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-muted/60">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(user.id)}
                    onChange={() => setSelectedMembers(prev =>
                      prev.includes(user.id)
                        ? prev.filter(id => id !== user.id)
                        : [...prev, user.id]
                    )}
                    className="accent-primary"
                  />
                  <UserAvatar
                    avatar={user.avatar}
                    name={user.name}
                    className="h-9 w-9 text-lg"
                    fallbackClassName="bg-primary/10 text-lg"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-sm font-medium text-foreground mb-1">Community Setup</p>
            <p className="text-xs text-muted-foreground">
              A default `#general` channel will be created automatically. After creation, you can add groups, create new groups inside the community, rename roles, assign hierarchy, and control permissions from the community info panel.
            </p>
          </div>
        </div>

        <div className="flex flex-shrink-0 gap-3 px-6 py-4 border-t border-border bg-card">
          <button type="button" onClick={() => setShowCreateCommunity(false)}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleCreate}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all active:scale-[0.98]">
            <Globe className="w-4 h-4" /> Create Community
          </button>
        </div>
      </div>
    </div>
  );
}
