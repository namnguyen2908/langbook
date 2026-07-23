'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash, Prohibit, ArrowsClockwise } from '@phosphor-icons/react';
import { useAuth } from '@/app/_components/providers/auth-provider';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/app/_lib/api';
import { Badge } from '@/app/_components/ui/badge';
import { Button } from '@/app/_components/ui/button';

interface ApiProvider {
  id: string;
  name: string;
  endpoint: string;
  isActive: boolean;
}

interface ApiKey {
  id: string;
  providerId: string;
  keyPreview: string;
  status: string;
  errorMessage: string | null;
  lastCheckedAt: string | null;
  createdAt: string;
  provider: ApiProvider;
}

const statusBadge: Record<string, { variant: 'success' | 'warning' | 'error' | 'neutral'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  rate_limited: { variant: 'warning', label: 'Rate Limited' },
  invalid: { variant: 'error', label: 'Invalid' },
  error: { variant: 'warning', label: 'Error' },
  disabled: { variant: 'neutral', label: 'Disabled' },
};

export function ProvidersContent() {
  const { token } = useAuth();

  const [providers, setProviders] = useState<ApiProvider[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const [showAddProvider, setShowAddProvider] = useState(false);
  const [showAddKey, setShowAddKey] = useState(false);
  const [newProviderName, setNewProviderName] = useState('');
  const [newProviderEndpoint, setNewProviderEndpoint] = useState('');
  const [newKey, setNewKey] = useState('');

  const [editName, setEditName] = useState('');
  const [editEndpoint, setEditEndpoint] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);

  const selectedProvider = providers.find((p) => p.id === selectedProviderId);

  useEffect(() => {
    if (!token) return;
    apiGet('/admin/api-providers', token)
      .then((data) => { setProviders(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token || !selectedProviderId) { setKeys([]); return; }
    apiGet(`/admin/api-keys?provider_id=${selectedProviderId}`, token)
      .then(setKeys)
      .catch(() => {});
  }, [token, selectedProviderId]);

  useEffect(() => {
    if (!selectedProvider) return;
    setEditName(selectedProvider.name);
    setEditEndpoint(selectedProvider.endpoint);
    setEditIsActive(selectedProvider.isActive);
  }, [selectedProvider]);

  function selectProvider(id: string) {
    setSelectedProviderId(id);
    setShowAddKey(false);
    setDeleteId(null);
  }

  async function loadKeys() {
    if (!token || !selectedProviderId) return;
    const data = await apiGet(`/admin/api-keys?provider_id=${selectedProviderId}`, token);
    setKeys(data);
  }

  async function handleUpdateProvider() {
    if (!token || !selectedProviderId || !editName.trim()) return;
    setSaving(true);
    setError('');
    try {
      const updated = await apiPatch(`/admin/api-providers/${selectedProviderId}`, {
        name: editName.trim(),
        endpoint: editEndpoint.trim(),
        isActive: editIsActive,
      }, token);
      setProviders((prev) => prev.map((p) => p.id === selectedProviderId ? updated : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddProvider() {
    if (!token || !newProviderName.trim()) return;
    setSaving(true);
    setError('');
    try {
      await apiPost('/admin/api-providers', { name: newProviderName.trim(), endpoint: newProviderEndpoint.trim() }, token);
      const data = await apiGet('/admin/api-providers', token);
      setProviders(data);
      setShowAddProvider(false);
      setNewProviderName('');
      setNewProviderEndpoint('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddKey() {
    if (!token || !selectedProviderId || !newKey.trim()) return;
    setSaving(true);
    setError('');
    try {
      await apiPost('/admin/api-keys', { providerId: selectedProviderId, key: newKey.trim() }, token);
      await loadKeys();
      setShowAddKey(false);
      setNewKey('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(key: ApiKey) {
    if (!token) return;
    setUpdating(key.id);
    try {
      await apiPatch(`/admin/api-keys/${key.id}`, { status: key.status === 'disabled' ? 'active' : 'disabled' }, token);
      await loadKeys();
    } catch {} finally { setUpdating(null); }
  }

  async function handleDeleteKey(id: string) {
    if (!token) return;
    try {
      await apiDelete(`/admin/api-keys/${id}`, token);
      setDeleteId(null);
      await loadKeys();
    } catch {}
  }

  if (loading) {
    return <p className="py-12 text-center text-sm text-neutral-500">Đang tải...</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-700">Providers</h2>
          <Button size="sm" variant="ghost" onClick={() => setShowAddProvider(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-1">
          {providers.length === 0 ? (
            <p className="py-8 text-center text-xs text-neutral-400">Chưa có provider</p>
          ) : (
            providers.map((p) => (
              <button
                key={p.id}
                onClick={() => selectProvider(p.id)}
                className={`w-full text-left rounded-[10px] px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                  selectedProviderId === p.id
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700'
                }`}
              >
                <div className="truncate">{p.name}</div>
                <div className="mt-0.5 truncate text-xs text-neutral-400">{p.endpoint || 'No endpoint'}</div>
              </button>
            ))
          )}
        </div>

        {showAddProvider && (
          <div className="rounded-[14px] border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="space-y-3">
              <input value={newProviderName} onChange={(e) => setNewProviderName(e.target.value)} placeholder="Tên provider" className="w-full rounded-[10px] border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
              <input value={newProviderEndpoint} onChange={(e) => setNewProviderEndpoint(e.target.value)} placeholder="Endpoint (tùy chọn)" className="w-full rounded-[10px] border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
              {error && <p className="text-xs text-error">{error}</p>}
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddProvider} disabled={saving || !newProviderName.trim()}>{saving ? '...' : 'Thêm'}</Button>
                <Button size="sm" variant="ghost" onClick={() => { setShowAddProvider(false); setError(''); }}>Huỷ</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        {!selectedProviderId ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-neutral-400">Chọn một provider bên trái để xem chi tiết</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-[14px] border border-neutral-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-neutral-700">Thông tin provider</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Tên</label>
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full rounded-[10px] border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Endpoint</label>
                  <input value={editEndpoint} onChange={(e) => setEditEndpoint(e.target.value)} className="w-full rounded-[10px] border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs font-medium text-neutral-500">Trạng thái</label>
                  <button
                    onClick={() => setEditIsActive(!editIsActive)}
                    className={`relative h-6 w-11 rounded-full transition-colors duration-150 ${editIsActive ? 'bg-success' : 'bg-neutral-300'}`}
                  >
                    <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-150 ${editIsActive ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                  <span className={`text-xs font-medium ${editIsActive ? 'text-success' : 'text-neutral-400'}`}>
                    {editIsActive ? 'Đang kích hoạt' : 'Đã tắt'}
                  </span>
                </div>
                {error && <p className="text-xs text-error">{error}</p>}
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleUpdateProvider} disabled={saving || !editName.trim()}>
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-700">API Keys ({keys.length})</h3>
                <Button size="sm" onClick={() => { setShowAddKey(true); setError(''); }}>
                  <Plus className="h-4 w-4" />
                  Thêm key
                </Button>
              </div>

              {showAddKey && (
                <div className="rounded-[14px] border border-neutral-200 bg-white p-4 shadow-sm">
                  <div className="space-y-3">
                    <input type="password" value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="Nhập API key..." className="w-full rounded-[10px] border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
                    {error && <p className="text-xs text-error">{error}</p>}
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddKey} disabled={saving || !newKey.trim()}>{saving ? '...' : 'Lưu'}</Button>
                      <Button size="sm" variant="ghost" onClick={() => { setShowAddKey(false); setError(''); }}>Huỷ</Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto rounded-[14px] border border-neutral-200 bg-white">
                <table className="w-full min-w-[500px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50">
                      <th className="px-4 py-3 font-medium text-neutral-500">Key</th>
                      <th className="px-4 py-3 font-medium text-neutral-500">Status</th>
                      <th className="px-4 py-3 font-medium text-neutral-500">Error</th>
                      <th className="px-4 py-3 font-medium text-neutral-500">Last Checked</th>
                      <th className="px-4 py-3 font-medium text-neutral-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keys.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-neutral-500">Chưa có API key nào</td>
                      </tr>
                    ) : (
                      keys.map((key) => {
                        const badge = statusBadge[key.status] ?? statusBadge.active;
                        return (
                          <tr key={key.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                            <td className="px-4 py-3 font-mono text-xs text-neutral-500">{key.keyPreview}</td>
                            <td className="px-4 py-3"><Badge variant={badge.variant}>{badge.label}</Badge></td>
                            <td className="max-w-[200px] truncate px-4 py-3 text-xs text-neutral-500">{key.errorMessage || '—'}</td>
                            <td className="px-4 py-3 text-xs text-neutral-500">{key.lastCheckedAt ? new Date(key.lastCheckedAt).toLocaleDateString('vi-VN') : '—'}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" disabled={updating === key.id} onClick={() => handleToggleActive(key)} title={key.status === 'disabled' ? 'Kích hoạt' : 'Vô hiệu'}>
                                  {key.status === 'disabled' ? <ArrowsClockwise className="h-4 w-4" /> : <Prohibit className="h-4 w-4" />}
                                </Button>
                                {deleteId === key.id ? (
                                  <div className="flex items-center gap-1">
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteKey(key.id)}>Xác nhận</Button>
                                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)}>Huỷ</Button>
                                  </div>
                                ) : (
                                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(key.id)} title="Xoá"><Trash className="h-4 w-4" /></Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
