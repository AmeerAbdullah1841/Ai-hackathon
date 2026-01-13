"use client";

import { useState, useEffect, useCallback } from "react";

type Tenant = {
  id: string;
  name: string;
  adminUsername: string;
  adminPassword: string;
  createdAt: string;
  updatedAt: string;
  teams?: Team[];
};

type Team = {
  id: string;
  name: string;
  username: string;
  password: string;
  tenantId: string | null;
  createdAt: string;
};

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    credentials: "include",
    cache: "no-store",
    ...init,
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload?.error ?? "Unexpected API error");
  }
  return res.json();
}

export function TenantsClient() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTenantName, setNewTenantName] = useState("");
  const [creating, setCreating] = useState(false);
  const [expandedTenants, setExpandedTenants] = useState<Set<string>>(new Set());

  const fetchTenants = useCallback(async () => {
    try {
      setLoading(true);
      const data = await request<Tenant[]>("/api/tenants");
      setTenants(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tenants");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName.trim()) return;

    setCreating(true);
    try {
      const tenant = await request<Tenant>("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTenantName.trim() }),
      });
      setTenants([tenant, ...tenants]);
      setNewTenantName("");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create tenant");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTenant = async (tenantId: string, tenantName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${tenantName}"? This will also delete all associated teams. This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await request(`/api/tenants/${tenantId}`, {
        method: "DELETE",
      });
      setTenants(tenants.filter((t) => t.id !== tenantId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete tenant");
    }
  };

  const toggleTenantDetails = async (tenantId: string) => {
    const isExpanded = expandedTenants.has(tenantId);
    const newExpanded = new Set(expandedTenants);

    if (isExpanded) {
      newExpanded.delete(tenantId);
    } else {
      newExpanded.add(tenantId);
      // Fetch tenant details if not already loaded
      const tenant = tenants.find((t) => t.id === tenantId);
      if (tenant && !tenant.teams) {
        try {
          const details = await request<Tenant>(`/api/tenants/${tenantId}`);
          setTenants(
            tenants.map((t) => (t.id === tenantId ? details : t))
          );
        } catch (err) {
          console.error("Failed to fetch tenant details:", err);
        }
      }
    }

    setExpandedTenants(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <p className="text-slate-500">Loading tenants...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Create New Tenant/School</h2>
        <form onSubmit={handleCreateTenant} className="flex gap-3">
          <input
            type="text"
            value={newTenantName}
            onChange={(e) => setNewTenantName(e.target.value)}
            placeholder="Tenant/School name"
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2"
            required
          />
          <button
            type="submit"
            disabled={creating}
            className="rounded-xl bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Tenant"}
          </button>
        </form>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-3xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">
          All Tenants ({tenants.length})
        </h2>
        {tenants.length === 0 ? (
          <p className="text-slate-500">No tenants created yet.</p>
        ) : (
          <div className="space-y-3">
            {tenants.map((tenant) => {
              const isExpanded = expandedTenants.has(tenant.id);
              return (
                <div
                  key={tenant.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        {tenant.name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Created: {new Date(tenant.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleTenantDetails(tenant.id)}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        {isExpanded ? "Hide Details" : "Show Details"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTenant(tenant.id, tenant.name)}
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-700 mb-2">
                          Admin Credentials
                        </p>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Username:</span>{" "}
                            <code className="rounded bg-white px-2 py-1 font-mono">
                              {tenant.adminUsername}
                            </code>
                          </p>
                          <p>
                            <span className="font-medium">Password:</span>{" "}
                            <code className="rounded bg-white px-2 py-1 font-mono">
                              {tenant.adminPassword}
                            </code>
                          </p>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">
                          Share these credentials with the tenant admin. They can
                          use these to login at /signin.
                        </p>
                      </div>

                      {tenant.teams && (
                        <div>
                          <p className="text-sm font-semibold text-slate-700 mb-2">
                            Teams ({tenant.teams.length})
                          </p>
                          {tenant.teams.length === 0 ? (
                            <p className="text-sm text-slate-500">
                              No teams created for this tenant yet.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {tenant.teams.map((team) => (
                                <div
                                  key={team.id}
                                  className="rounded-lg border border-slate-200 bg-white p-3"
                                >
                                  <p className="font-medium">{team.name}</p>
                                  <p className="text-xs text-slate-500">
                                    {team.username}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


