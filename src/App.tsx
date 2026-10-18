import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  AlertCircle, ArrowDownUp, Bell, BookOpen, CalendarDays, Check, CheckCheck,
  CircleHelp, Clock3, Cloud, GraduationCap, LayoutDashboard,
  ListTodo, LogOut, Menu, Moon, MoreHorizontal, Pencil, Plus, Search,
  Settings, ShieldCheck, Sun, Trash2, TrendingUp, X,
} from 'lucide-react'
import { supabase } from './lib/supabase'
import type { Session } from '@supabase/supabase-js'
import './App.css'

type Priority = 'Low' | 'Medium' | 'High'
type AssignmentStatus = 'Pending' | 'Completed'
type ReviewStatus = 'Pending' | 'Approved' | 'Redo' | 'Rejected'
type Page = 'Dashboard' | 'All Assignments' | 'Completed' | 'Overdue' | 'Settings'
type Assignment = {
  id: string
  title: string
  subject: string
  description: string
  dueDate: string
  priority: Priority
  completed: boolean
  reviewStatus: ReviewStatus
  createdAt: string
}
type AssignmentInput = Omit<Assignment, 'id' | 'createdAt' | 'reviewStatus'>
type SortOption = 'due-asc' | 'due-desc' | 'priority' | 'created'
type FieldErrors = Partial<Record<keyof AssignmentInput, string>>

const STORAGE_KEY = 'studytrack.assignments.v1'
const THEME_KEY = 'studytrack.theme'
const MAX_TITLE = 100
const MAX_SUBJECT = 80
const MAX_DESCRIPTION = 1000
const priorityRank: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 }
const currentYear = new Date().getFullYear()
const navigation: { name: Page; icon: typeof LayoutDashboard }[] = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'All Assignments', icon: ListTodo },
  { name: 'Completed', icon: CheckCheck },
  { name: 'Overdue', icon: Clock3 },
]

function localDateString(date = new Date()) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addCalendarDays(value: string, days: number) {
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + days)
  return localDateString(date)
}

function isValidDateString(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const parsed = new Date(year, month - 1, day)
  return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day
}

function isReviewStatus(value: unknown): value is ReviewStatus {
  return value === 'Pending' || value === 'Approved' || value === 'Redo' || value === 'Rejected'
}

function getStatus(assignment: Assignment, today = localDateString()): AssignmentStatus | 'Overdue' {
  if (assignment.completed) return 'Completed'
  return assignment.dueDate < today ? 'Overdue' : 'Pending'
}

function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  if (!isValidDateString(value)) return 'Invalid date'
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', options ?? {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function validateAssignment(input: AssignmentInput): FieldErrors {
  const errors: FieldErrors = {}
  const title = input.title.trim()
  if (!title) errors.title = 'Please enter an assignment title.'
  else if (title.length > MAX_TITLE) errors.title = `Title must be ${MAX_TITLE} characters or fewer.`
  const subject = input.subject.trim()
  if (!subject) errors.subject = 'Please enter a subject or unit.'
  else if (subject.length > MAX_SUBJECT) errors.subject = `Subject must be ${MAX_SUBJECT} characters or fewer.`
  const description = input.description.trim()
  if (!description) errors.description = 'Please enter an assignment description.'
  else if (description.length > MAX_DESCRIPTION) errors.description = `Description must be ${MAX_DESCRIPTION} characters or fewer.`
  if (!input.dueDate) errors.dueDate = 'Please choose a due date.'
  else if (!isValidDateString(input.dueDate)) errors.dueDate = 'Enter a valid calendar date.'
  return errors
}

function readLocalAssignments(): { assignments: Assignment[]; warning: string } {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return { assignments: [], warning: '' }
    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed)) throw new Error('Stored assignments are not a list.')
    type StoredAssignment = Omit<Assignment, 'reviewStatus'> & { reviewStatus?: ReviewStatus }
    const assignments: Assignment[] = parsed.filter((item): item is StoredAssignment =>
      item !== null && typeof item === 'object' &&
      typeof item.id === 'string' && typeof item.title === 'string' &&
      typeof item.subject === 'string' && typeof item.description === 'string' &&
      typeof item.dueDate === 'string' && isValidDateString(item.dueDate) &&
      (item.priority === 'Low' || item.priority === 'Medium' || item.priority === 'High') &&
      typeof item.completed === 'boolean' && typeof item.createdAt === 'string' &&
      (item.reviewStatus === undefined || isReviewStatus(item.reviewStatus)),
    ).map((item) => ({ ...item, reviewStatus: item.reviewStatus ?? 'Pending' }))
    return {
      assignments,
      warning: assignments.length !== parsed.length
        ? 'Some saved assignments were invalid and could not be loaded.'
        : '',
    }
  } catch {
    return { assignments: [], warning: 'Saved data could not be read. Your browser storage may be unavailable or corrupted.' }
  }
}

function mapCloudRow(row: Record<string, unknown>): Assignment {
  if (!isReviewStatus(row.review_status)) {
    throw new Error('Assignment has an invalid review status. Re-run the Supabase schema script to update your database.')
  }
  return {
    id: String(row.id),
    title: String(row.title),
    subject: String(row.subject ?? ''),
    description: String(row.description ?? ''),
    dueDate: String(row.due_date),
    priority: row.priority as Priority,
    completed: Boolean(row.completed),
    reviewStatus: row.review_status,
    createdAt: String(row.created_at),
  }
}

function App() {
  const isCloudMode = Boolean(supabase)
  const [localInitial] = useState(() => isCloudMode ? { assignments: [], warning: '' } : readLocalAssignments())
  const [session, setSession] = useState<Session | null>(null)
  const [authReady, setAuthReady] = useState(!isCloudMode)
  const [assignments, setAssignments] = useState<Assignment[]>(localInitial.assignments)
  const [page, setPage] = useState<Page>('Dashboard')
  const [editing, setEditing] = useState<Assignment | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try { return window.localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light' }
    catch { return 'light' }
  })
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [priorityFilter, setPriorityFilter] = useState('All priorities')
  const [sort, setSort] = useState<SortOption>('due-asc')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState(localInitial.warning)
  const [busy, setBusy] = useState(false)
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [today, setToday] = useState(() => localDateString())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { window.localStorage.setItem(THEME_KEY, theme) } catch { /* Theme is still applied for this session. */ }
  }, [theme])

  useEffect(() => {
    const now = new Date()
    const nextMidnight = new Date(now)
    nextMidnight.setHours(24, 0, 0, 100)
    const timer = window.setTimeout(() => setToday(localDateString()), nextMidnight.getTime() - now.getTime())
    return () => window.clearTimeout(timer)
  }, [today])

  useEffect(() => {
    if (!supabase) return
    let active = true
    void supabase.auth.getSession()
      .then(({ data, error: authError }) => {
        if (!active) return
        if (authError) setError(`Could not restore your session: ${authError.message}`)
        setSession(data.session)
        setAuthReady(true)
      })
      .catch((cause: unknown) => {
        if (!active) return
        setError(`Could not restore your session: ${cause instanceof Error ? cause.message : 'Network error.'}`)
        setAuthReady(true)
      })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setAssignments([])
      setLoadedUserId(null)
      setError('')
      setAuthReady(true)
    })
    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!supabase || !session?.user) return
    let active = true
    void (async () => {
      try {
        const { data, error: loadError } = await supabase.from('assignments').select('*').order('created_at', { ascending: false })
        if (!active) return
        if (loadError) setError(`Assignments could not be loaded: ${loadError.message}`)
        else setAssignments((data ?? []).map((row) => mapCloudRow(row as Record<string, unknown>)))
        setLoadedUserId(session.user.id)
      } catch (cause) {
        if (!active) return
        setError(`Assignments could not be loaded: ${cause instanceof Error ? cause.message : 'Network error.'}`)
        setLoadedUserId(session.user.id)
      }
    })()
    return () => { active = false }
  }, [session])

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(''), 3500)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const loadingAssignments = Boolean(isCloudMode && session?.user && loadedUserId !== session.user.id)
  const overdue = assignments.filter((item) => getStatus(item, today) === 'Overdue')
  const completed = assignments.filter((item) => item.completed)
  const pending = assignments.filter((item) => getStatus(item, today) === 'Pending')
  const upcomingLimit = addCalendarDays(today, 7)
  const upcoming = assignments
    .filter((item) => !item.completed && item.dueDate >= today && item.dueDate <= upcomingLimit)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4)
  const filteredAssignments = useMemo(() => {
    let result = assignments.filter((assignment) => {
      const status = getStatus(assignment, today)
      const matchesQuery = `${assignment.title} ${assignment.subject}`.toLowerCase().includes(query.trim().toLowerCase())
      const matchesStatus = statusFilter === 'All statuses' || status === statusFilter
      const matchesPriority = priorityFilter === 'All priorities' || assignment.priority === priorityFilter
      const matchesPage =
        page === 'Completed' ? assignment.completed :
        page === 'Overdue' ? status === 'Overdue' :
        page === 'Dashboard' ? !assignment.completed : true
      return matchesQuery && matchesStatus && matchesPriority && matchesPage
    })
    result = [...result].sort((a, b) => {
      if (sort === 'due-desc') return b.dueDate.localeCompare(a.dueDate)
      if (sort === 'priority') return priorityRank[a.priority] - priorityRank[b.priority]
      if (sort === 'created') return b.createdAt.localeCompare(a.createdAt)
      return a.dueDate.localeCompare(b.dueDate)
    })
    return result
  }, [assignments, page, priorityFilter, query, sort, statusFilter, today])

  async function persistLocal(next: Assignment[]) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setAssignments(next)
    } catch (cause) {
      const detail = cause instanceof Error ? cause.message : 'Browser storage is unavailable.'
      throw new Error(`Could not save assignment locally: ${detail}`)
    }
  }

  async function saveAssignment(input: AssignmentInput, id?: string) {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      if (supabase) {
        if (!session?.user) throw new Error('Please sign in before saving assignments.')
        const payload = {
          title: input.title.trim(),
          subject: input.subject.trim(),
          description: input.description.trim(),
          due_date: input.dueDate,
          priority: input.priority,
          completed: input.completed,
          review_status: id
            ? assignments.find((item) => item.id === id)?.reviewStatus ?? 'Pending'
            : 'Pending',
          user_id: session.user.id,
        }
        const result = id
          ? await supabase.from('assignments').update(payload).eq('id', id).select().single()
          : await supabase.from('assignments').insert(payload).select().single()
        if (result.error) throw new Error(result.error.message)
        const saved = mapCloudRow(result.data as Record<string, unknown>)
        setAssignments((current) => id
          ? current.map((item) => item.id === id ? saved : item)
          : [saved, ...current])
      } else {
        const saved: Assignment = {
          ...input,
          title: input.title.trim(),
          subject: input.subject.trim(),
          description: input.description.trim(),
          reviewStatus: id
            ? assignments.find((item) => item.id === id)?.reviewStatus ?? 'Pending'
            : 'Pending',
          id: id ?? crypto.randomUUID(),
          createdAt: id ? assignments.find((item) => item.id === id)?.createdAt ?? new Date().toISOString() : new Date().toISOString(),
        }
        const next = id ? assignments.map((item) => item.id === id ? saved : item) : [saved, ...assignments]
        await persistLocal(next)
      }
      setShowForm(false)
      setEditing(null)
      setNotice(id ? 'Assignment updated successfully.' : 'Assignment saved successfully.')
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'An unexpected error occurred while saving.'
      setError(`Save failed: ${message}`)
      throw cause
    } finally {
      setBusy(false)
    }
  }

  async function toggleComplete(assignment: Assignment) {
    const nextValue = !assignment.completed
    setBusy(true)
    setError('')
    try {
      if (supabase) {
        if (!session) throw new Error('Please sign in before updating assignments.')
        const { error: updateError } = await supabase.from('assignments')
          .update({ completed: nextValue }).eq('id', assignment.id)
        if (updateError) throw new Error(updateError.message)
        setAssignments((current) => current.map((item) =>
          item.id === assignment.id ? { ...item, completed: nextValue } : item))
      } else {
        await persistLocal(assignments.map((item) =>
          item.id === assignment.id ? { ...item, completed: nextValue } : item))
      }
      setNotice(nextValue ? 'Nice work — assignment completed!' : 'Assignment moved back to pending.')
    } catch (cause) {
      setError(`Update failed: ${cause instanceof Error ? cause.message : 'Unknown error.'}`)
    } finally { setBusy(false) }
  }

  async function deleteAssignment(assignment: Assignment) {
    if (!window.confirm(`Delete “${assignment.title}”? This cannot be undone.`)) return
    setBusy(true)
    setError('')
    try {
      if (supabase) {
        if (!session) throw new Error('Please sign in before deleting assignments.')
        const { error: deleteError } = await supabase.from('assignments').delete().eq('id', assignment.id)
        if (deleteError) throw new Error(deleteError.message)
        setAssignments((current) => current.filter((item) => item.id !== assignment.id))
      } else {
        await persistLocal(assignments.filter((item) => item.id !== assignment.id))
      }
      setNotice('Assignment deleted.')
    } catch (cause) {
      setError(`Delete failed: ${cause instanceof Error ? cause.message : 'Unknown error.'}`)
    } finally { setBusy(false) }
  }

  async function signOut() {
    if (!supabase) return
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) setError(`Sign out failed: ${signOutError.message}`)
  }

  if (!authReady) return <div className="loading-screen"><div className="spinner" />Checking your session…</div>
  if (isCloudMode && !session) {
    return <AuthScreen mode={authMode} setMode={setAuthMode} onSuccess={(nextSession) => setSession(nextSession)} />
  }

  const filteredPageTitle = page === 'Dashboard' ? 'All assignments' : page
  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><GraduationCap size={22} /></div><span>studytrack</span></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map(({ name, icon: Icon }) => (
            <button key={name} className={`nav-item ${page === name ? 'active' : ''}`} onClick={() => { setPage(name); setMenuOpen(false) }}>
              <Icon size={18} strokeWidth={1.8} /><span>{name}</span>
              {name === 'Overdue' && overdue.length > 0 && <span className="nav-count">{overdue.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleHelp size={17} /></div>
            <strong>Need a hand?</strong>
            <p>Stay one step ahead of every deadline.</p>
            <button onClick={() => setPage('Settings')}>Explore tips <span>↗</span></button>
          </div>
          <button className={`nav-item ${page === 'Settings' ? 'active' : ''}`} onClick={() => { setPage('Settings'); setMenuOpen(false) }}>
            <Settings size={18} strokeWidth={1.8} /><span>Settings</span>
          </button>
          <div className="profile">
            <div className="avatar">{session?.user.email?.slice(0, 1).toUpperCase() ?? 'S'}</div>
            <div className="profile-copy"><strong>{session?.user.email?.split('@')[0] ?? 'Student'}</strong><small>{isCloudMode ? 'Student account' : 'Local demo mode'}</small></div>
            {isCloudMode && <button aria-label="Sign out" className="icon-button" onClick={() => void signOut()}><LogOut size={16} /></button>}
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation"><Menu size={20} /></button>
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-divider">/</span><strong>{page}</strong></div>
          <div className="topbar-actions">
            {isCloudMode ? <span className="mode-pill cloud-pill"><Cloud size={14} /> Cloud sync</span> : <span className="mode-pill"><span className="mode-dot" /> Local demo</span>}
            <button className="icon-button theme-button" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button className="icon-button notification-button" aria-label="Show upcoming deadlines" onClick={() => { setPage('Dashboard'); setNotice('Upcoming deadlines are highlighted on your dashboard.') }}><Bell size={18} /><span className="notification-dot" /></button>
            <div className="avatar top-avatar">{session?.user.email?.slice(0, 1).toUpperCase() ?? 'S'}</div>
          </div>
        </header>

        <div className="content-wrap">
          {!isCloudMode && <div className="demo-banner"><ShieldCheck size={15} /> Your assignments are saved on this device. <button onClick={() => setPage('Settings')}>Learn about cloud sync</button></div>}
          {error && <div className="alert error-alert" role="alert"><AlertCircle size={17} /><span>{error}</span><button className="icon-button" onClick={() => setError('')} aria-label="Dismiss error"><X size={15} /></button></div>}
          {notice && <div className="alert success-alert" role="status"><Check size={17} /><span>{notice}</span></div>}

          {page === 'Settings' ? (
            <SettingsPage theme={theme} setTheme={setTheme} cloudMode={isCloudMode} onClear={async () => {
              if (!window.confirm('Delete all assignments saved on this device? This cannot be undone.')) return
              try { await persistLocal([]); setNotice('All local assignments were cleared.') }
              catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not clear local data.') }
            }} />
          ) : (
            <>
              <div className="page-heading">
                <div><p className="eyebrow">{page === 'Dashboard' ? 'YOUR LEARNING, AT A GLANCE' : 'STAY ON TOP OF YOUR WORK'}</p><h1>{page === 'Dashboard' ? 'Good to see you, student' : page === 'All Assignments' ? 'All assignments' : page}</h1>
                  <p className="page-subtitle">{page === 'Dashboard' ? 'A little progress each day adds up to big results.' : page === 'Completed' ? 'Look at everything you have accomplished.' : page === 'Overdue' ? 'These assignments need your attention.' : 'Keep every task and deadline in one place.'}</p></div>
                <button className="primary-button" onClick={() => { setEditing(null); setShowForm(true) }}><Plus size={17} /> New assignment</button>
              </div>

              {page === 'Dashboard' && <DashboardStats total={assignments.length} pending={pending.length} completed={completed.length} overdue={overdue.length} />}
              {page === 'Dashboard' && (
                <section className="upcoming-section">
                  <div className="section-heading"><div><h2>Coming up</h2><p>Your next deadlines, all in one place</p></div><button className="text-button" onClick={() => setPage('All Assignments')}>View all <span>→</span></button></div>
                  {upcoming.length ? <div className="upcoming-grid">{upcoming.map((item) => <UpcomingCard key={item.id} assignment={item} today={today} onClick={() => { setEditing(item); setShowForm(true) }} />)}</div> :
                    <div className="upcoming-empty"><div className="empty-art"><CalendarDays size={22} /></div><div><strong>Nothing due soon</strong><p>You’re all clear for the next seven days. Enjoy the breathing room!</p></div><button className="secondary-button" onClick={() => { setEditing(null); setShowForm(true) }}><Plus size={15} /> Add an assignment</button></div>}
                </section>
              )}

              <section className={`assignment-section ${page === 'Dashboard' ? 'dashboard-list' : ''}`}>
                <div className="section-heading list-heading"><div><h2>{filteredPageTitle}</h2><p>{page === 'Dashboard' ? 'Your active tasks at a glance' : `${filteredAssignments.length} ${filteredAssignments.length === 1 ? 'assignment' : 'assignments'} found`}</p></div>
                  <div className="list-actions"><div className="search-field"><Search size={16} /><input aria-label="Search assignments" placeholder="Search assignments..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>⌘ K</kbd></div>
                    <button className="secondary-button filter-toggle" onClick={() => document.getElementById('filter-controls')?.classList.toggle('filters-visible')}><ArrowDownUp size={15} /> Filters</button></div>
                </div>
                <div id="filter-controls" className="filter-controls">
                  <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All statuses</option><option>Pending</option><option>Completed</option><option>Overdue</option></select>
                  <select aria-label="Filter by priority" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}><option>All priorities</option><option>High</option><option>Medium</option><option>Low</option></select>
                  <select aria-label="Sort assignments" value={sort} onChange={(event) => setSort(event.target.value as SortOption)}><option value="due-asc">Due date: earliest</option><option value="due-desc">Due date: latest</option><option value="priority">Priority</option><option value="created">Recently created</option></select>
                </div>
                <p className="review-status-note">Review statuses: Pending, Approved, Redo, Rejected. New assignments start as Pending.</p>
                {loadingAssignments ? <div className="loading-inline"><span className="spinner" /> Loading your assignments…</div> : filteredAssignments.length ? (
                  <div className="assignment-list">
                    {filteredAssignments.slice(0, page === 'Dashboard' ? 5 : undefined).map((assignment) => (
                      <AssignmentRow key={assignment.id} assignment={assignment} today={today} busy={busy}
                        onToggle={() => void toggleComplete(assignment)} onEdit={() => { setEditing(assignment); setShowForm(true) }} onDelete={() => void deleteAssignment(assignment)} />
                    ))}
                  </div>
                ) : <EmptyAssignments page={page} onAdd={() => { setEditing(null); setShowForm(true) }} />}
              </section>
            </>
          )}
          <footer className="page-footer"><span>Made for your next big thing <span className="footer-heart">♥</span></span><span>StudyTrack · {currentYear}</span></footer>
        </div>
      </main>
      {showForm && <AssignmentForm assignment={editing} busy={busy} onClose={() => { setShowForm(false); setEditing(null) }} onSave={saveAssignment} />}
    </div>
  )
}

function DashboardStats({ total, pending, completed, overdue }: { total: number; pending: number; completed: number; overdue: number }) {
  const cards = [
    { title: 'Total assignments', value: total, note: 'Across all your subjects', icon: BookOpen, tone: 'lavender', trend: <TrendingUp size={14} /> },
    { title: 'In progress', value: pending, note: 'Ready for your attention', icon: Clock3, tone: 'blue', trend: null },
    { title: 'Completed', value: completed, note: 'You’re making progress!', icon: CheckCheck, tone: 'green', trend: null },
    { title: 'Overdue', value: overdue, note: overdue ? 'Let’s get back on track' : 'Nothing overdue — great!', icon: CalendarDays, tone: 'orange', trend: null },
  ]
  return <div className="stats-grid">{cards.map(({ title, value, note, icon: Icon, tone, trend }) => <article className="stat-card" key={title}><div className={`stat-icon ${tone}`}><Icon size={18} /></div><div className="stat-title">{title}{trend && <span className="stat-trend">{trend}</span>}</div><strong className="stat-value">{value}</strong><span className="stat-note">{note}</span></article>)}</div>
}

function UpcomingCard({ assignment, today, onClick }: { assignment: Assignment; today: string; onClick: () => void }) {
  const dayGap = Math.round((new Date(`${assignment.dueDate}T12:00:00`).getTime() - new Date(`${today}T12:00:00`).getTime()) / 86400000)
  const deadlineClass = dayGap === 0 ? 'deadline-today' : dayGap <= 2 ? 'deadline-soon' : ''
  return <button className="upcoming-card" onClick={onClick}><div className="upcoming-top"><div className="subject-mark">{assignment.subject.slice(0, 1).toUpperCase() || <BookOpen size={15} />}</div><span className={`priority-dot ${assignment.priority.toLowerCase()}`} title={`${assignment.priority} priority`} /></div><strong>{assignment.title}</strong><span className="upcoming-subject">{assignment.subject || 'No subject'}</span><div className={`upcoming-date ${deadlineClass}`}><CalendarDays size={14} /><span>{dayGap === 0 ? 'Due today' : dayGap === 1 ? 'Due tomorrow' : `Due ${formatDate(assignment.dueDate, { month: 'short', day: 'numeric' })}`}</span><span className="date-arrow">↗</span></div></button>
}

function AssignmentRow({ assignment, today, busy, onToggle, onEdit, onDelete }: {
  assignment: Assignment; today: string; busy: boolean; onToggle: () => void; onEdit: () => void; onDelete: () => void
}) {
  const status = getStatus(assignment, today)
  const [actionsOpen, setActionsOpen] = useState(false)
  return <article className={`assignment-row ${assignment.completed ? 'is-complete' : ''}`}><button className={`completion-check ${assignment.completed ? 'checked' : ''}`} aria-label={assignment.completed ? 'Mark pending' : 'Mark completed'} disabled={busy} onClick={onToggle}>{assignment.completed && <Check size={13} />}</button><div className="assignment-main"><strong>{assignment.title}</strong><div className="assignment-meta"><span>{assignment.subject}</span><span className="meta-dot">·</span><span className={`due-date ${status === 'Overdue' ? 'date-overdue' : ''}`}>{status === 'Overdue' ? 'Overdue · ' : 'Due '}{formatDate(assignment.dueDate, { month: 'short', day: 'numeric' })}</span></div></div><span className={`review-status-pill ${assignment.reviewStatus.toLowerCase()}`} aria-label={`Review status: ${assignment.reviewStatus}`}>Review: {assignment.reviewStatus}</span><span className={`status-pill ${status.toLowerCase()}`}>{status}</span><span className={`priority-pill ${assignment.priority.toLowerCase()}`}><span />{assignment.priority}</span><div className="row-actions"><button aria-label={`Actions for ${assignment.title}`} className="icon-button" onClick={() => setActionsOpen((open) => !open)}><MoreHorizontal size={18} /></button>{actionsOpen && <div className="actions-menu"><button onClick={() => { setActionsOpen(false); onEdit() }}><Pencil size={14} /> Edit</button><button className="delete-action" onClick={() => { setActionsOpen(false); onDelete() }}><Trash2 size={14} /> Delete</button></div>}</div></article>
}

function EmptyAssignments({ page, onAdd }: { page: Page; onAdd: () => void }) {
  const isFiltered = page !== 'Dashboard' && page !== 'All Assignments' && page !== 'Completed' && page !== 'Overdue'
  return <div className="empty-state"><div className="empty-art"><ListTodo size={23} /></div><h3>{isFiltered ? 'No assignments match these filters' : page === 'Completed' ? 'No completed assignments yet' : page === 'Overdue' ? 'No overdue assignments' : 'Your assignment list is clear'}</h3><p>{page === 'Completed' ? 'Finish a task and it will show up here.' : page === 'Overdue' ? 'You’re right on schedule. Keep it up!' : 'Add an assignment to get your deadlines under control.'}</p>{page !== 'Completed' && page !== 'Overdue' && <button className="secondary-button" onClick={onAdd}><Plus size={15} /> Create assignment</button>}</div>
}

function AssignmentForm({ assignment, busy, onClose, onSave }: {
  assignment: Assignment | null; busy: boolean; onClose: () => void; onSave: (input: AssignmentInput, id?: string) => Promise<void>
}) {
  const [fields, setFields] = useState<AssignmentInput>(() => assignment ? {
    title: assignment.title, subject: assignment.subject, description: assignment.description,
    dueDate: assignment.dueDate, priority: assignment.priority, completed: assignment.completed,
  } : { title: '', subject: '', description: '', dueDate: '', priority: 'Medium', completed: false })
  const [errors, setErrors] = useState<FieldErrors>({})
  const titleRef = useRef<HTMLInputElement>(null)
  const subjectRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const dueDateRef = useRef<HTMLInputElement>(null)

  function update<K extends keyof AssignmentInput>(key: K, value: AssignmentInput[K]) {
    setFields((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateAssignment(fields)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      if (nextErrors.title) titleRef.current?.focus()
      else if (nextErrors.subject) subjectRef.current?.focus()
      else if (nextErrors.description) descriptionRef.current?.focus()
      else if (nextErrors.dueDate) dueDateRef.current?.focus()
      return
    }
    try { await onSave(fields, assignment?.id) } catch { /* Parent exposes the save failure; keep form values intact. */ }
  }
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose() }}><section className="form-modal" role="dialog" aria-modal="true" aria-labelledby="form-title"><div className="modal-heading"><div><span className="modal-kicker">{assignment ? 'KEEP IT UP TO DATE' : 'MAKE A PLAN'}</span><h2 id="form-title">{assignment ? 'Edit assignment' : 'New assignment'}</h2><p>A little planning goes a long way.</p></div><button className="icon-button close-modal" aria-label="Close form" onClick={onClose}><X size={19} /></button></div>
    <form onSubmit={(event) => void submit(event)} noValidate>
      <label className="form-label" htmlFor="title">Assignment title <span className="required">*</span></label><input ref={titleRef} id="title" className={`form-input ${errors.title ? 'invalid' : ''}`} value={fields.title} onChange={(event) => update('title', event.target.value)} maxLength={MAX_TITLE + 5} placeholder="e.g. Research project draft" required aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'title-error' : undefined} />{errors.title && <span id="title-error" className="field-error">{errors.title}</span>}
      <label className="form-label" htmlFor="subject">Subject or unit <span className="required">*</span></label><input ref={subjectRef} id="subject" className={`form-input ${errors.subject ? 'invalid' : ''}`} value={fields.subject} onChange={(event) => update('subject', event.target.value)} maxLength={MAX_SUBJECT + 5} placeholder="e.g. Introduction to Psychology" required aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? 'subject-error' : undefined} />{errors.subject && <span id="subject-error" className="field-error">{errors.subject}</span>}
      <label className="form-label" htmlFor="description">Description <span className="required">*</span></label><textarea ref={descriptionRef} id="description" className={`form-input form-textarea ${errors.description ? 'invalid' : ''}`} value={fields.description} onChange={(event) => update('description', event.target.value)} maxLength={MAX_DESCRIPTION + 10} placeholder="Add a few notes about what needs to be done..." required aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? 'description-error' : undefined} />{errors.description && <span id="description-error" className="field-error">{errors.description}</span>}
      <div className="form-row"><div className="form-field"><label className="form-label" htmlFor="due-date">Due date <span className="required">*</span></label><input ref={dueDateRef} id="due-date" type="date" className={`form-input ${errors.dueDate ? 'invalid' : ''}`} value={fields.dueDate} onChange={(event) => update('dueDate', event.target.value)} required aria-invalid={Boolean(errors.dueDate)} aria-describedby={errors.dueDate ? 'due-error' : 'due-help'} />{errors.dueDate ? <span id="due-error" className="field-error">{errors.dueDate}</span> : <span id="due-help" className="field-hint">Past dates are allowed for late work.</span>}</div>
      <div className="form-field"><label className="form-label" htmlFor="priority">Priority <span className="required">*</span></label><select id="priority" className="form-input" value={fields.priority} onChange={(event) => update('priority', event.target.value as Priority)} required><option>Low</option><option>Medium</option><option>High</option></select></div></div>
      <label className="status-check"><input type="checkbox" checked={fields.completed} onChange={(event) => update('completed', event.target.checked)} /><span className="custom-checkbox">{fields.completed && <Check size={13} />}</span><span>Mark as completed</span></label>
      <div className="form-footer"><button type="button" className="secondary-button" onClick={onClose} disabled={busy}>Cancel</button><button type="submit" className="primary-button" disabled={busy}>{busy ? <><span className="button-spinner" /> Saving…</> : <>{assignment ? 'Save changes' : <><Plus size={16} /> Add assignment</>}</>}</button></div>
    </form></section></div>
}

function SettingsPage({ theme, setTheme, cloudMode, onClear }: { theme: 'light' | 'dark'; setTheme: (theme: 'light' | 'dark') => void; cloudMode: boolean; onClear: () => void }) {
  return <div className="settings-page"><div className="page-heading"><div><p className="eyebrow">MAKE IT YOURS</p><h1>Settings</h1><p className="page-subtitle">A few little tweaks to make StudyTrack feel like yours.</p></div></div>
    <section className="settings-card"><div className="settings-icon"><Sun size={18} /></div><div className="settings-copy"><strong>Appearance</strong><p>Choose a theme that feels right for you.</p></div><div className="theme-toggle"><button className={theme === 'light' ? 'selected' : ''} onClick={() => setTheme('light')}><Sun size={15} /> Light</button><button className={theme === 'dark' ? 'selected' : ''} onClick={() => setTheme('dark')}><Moon size={15} /> Dark</button></div></section>
    <section className="settings-card"><div className="settings-icon"><ShieldCheck size={18} /></div><div className="settings-copy"><strong>Data & privacy</strong><p>{cloudMode ? 'Your assignments are stored in your secure Supabase account.' : 'Local demo mode stores assignments in this browser only. They won’t sync between devices.'}</p></div><span className={`settings-status ${cloudMode ? 'cloud-pill' : ''}`}>{cloudMode ? <><Cloud size={14} /> Cloud</> : 'Local only'}</span></section>
    {!cloudMode && <section className="settings-card danger-settings"><div className="settings-icon"><Trash2 size={18} /></div><div className="settings-copy"><strong>Clear local assignments</strong><p>Permanently remove all assignments saved in this browser.</p></div><button className="secondary-button danger-button" onClick={onClear}>Clear data</button></section>}
    <div className="tips-panel"><div className="tips-icon"><Bell size={17} /></div><div><strong>About deadline notifications</strong><p>StudyTrack highlights upcoming and overdue work in the app. Browser notifications aren’t enabled yet, so reminders won’t arrive when the app is closed.</p></div></div>
    {!cloudMode && <div className="cloud-setup"><h2>Want your assignments everywhere?</h2><p>Connect a Supabase project to enable secure login and cloud syncing. Follow the setup instructions in the README to get started.</p><div className="cloud-setup-label"><Cloud size={15} /> Supabase integration ready to configure</div></div>}
  </div>
}

function AuthScreen({ mode, setMode, onSuccess }: { mode: 'login' | 'register'; setMode: (mode: 'login' | 'register') => void; onSuccess: (session: Session | null) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) return
    setBusy(true); setError('')
    try {
      const response = mode === 'login'
        ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
        : await supabase.auth.signUp({ email: email.trim(), password })
      if (response.error) throw new Error(response.error.message)
      if (response.data.session) onSuccess(response.data.session)
      else if (mode === 'register') setError('Check your email to confirm your account, then sign in.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Authentication failed.')
    } finally { setBusy(false) }
  }
  return <div className="auth-screen"><div className="auth-card"><div className="brand auth-brand"><div className="brand-mark"><GraduationCap size={22} /></div><span>studytrack</span></div><div className="auth-welcome"><span className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'START YOUR JOURNEY'}</span><h1>{mode === 'login' ? 'Good to have you back.' : 'Create your account.'}</h1><p>Your assignments, organized and ready when you are.</p></div>{error && <div className="alert error-alert"><AlertCircle size={16} />{error}</div>}<form onSubmit={(event) => void submit(event)}><label className="form-label" htmlFor="auth-email">Email address</label><input id="auth-email" className="form-input" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /><label className="form-label" htmlFor="auth-password">Password</label><input id="auth-password" className="form-input" type="password" required minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" /><button className="primary-button auth-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button></form><p className="auth-switch">{mode === 'login' ? 'New to StudyTrack?' : 'Already have an account?'} <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></p><div className="auth-secure"><ShieldCheck size={14} /> Your data is private and protected</div></div><div className="auth-decoration"><div className="decor-circle circle-one" /><div className="decor-circle circle-two" /><div className="auth-quote"><GraduationCap size={28} /><p>“Small steps every day lead to big results.”</p><span>YOUR STUDY SPACE</span></div></div></div>
}

export default App
