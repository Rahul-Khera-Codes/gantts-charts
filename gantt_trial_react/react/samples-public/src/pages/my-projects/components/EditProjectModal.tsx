import { useEffect, useMemo, useState, type ReactNode } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import NotesIcon from '@mui/icons-material/Notes';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import modalPenIcon from '../../../assets/modal_pen.svg';
import modalHistoryIcon from '../../../assets/modal_history.svg';
import modalCommentIcon from '../../../assets/modal_comment.svg';
import modalLinkIcon from '../../../assets/modal_link.svg';
import type { Project } from '../types';

interface EditProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const STEPS = ['Details', 'R&D', 'Stage Sets', 'Milestones', 'Attachments'] as const;
type StepIndex = 0 | 1 | 2 | 3 | 4;

const SIDE_ICONS = [
  { id: 'edit', src: modalPenIcon, alt: 'Edit', active: true },
  { id: 'history', src: modalHistoryIcon, alt: 'History', active: false },
  { id: 'chat', src: modalCommentIcon, alt: 'Comments', active: false },
  { id: 'link', src: modalLinkIcon, alt: 'Open', active: false },
];

const PRIORITY_DOT: Record<string, string> = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#f59e0b',
  Low: '#22c55e',
};

const STATUS_DOT: Record<string, string> = {
  'Not Started': '#9ca3af',
  'In Progress': '#3b82f6',
};

interface FormState {
  title: string;
  externalCode: string;
  description: string;
  category: string;
  stage: string;
  priority: string;
  status: string;
  owner: string;
  assignees: string;
  researchNotes: string;
  developmentNotes: string;
  stageSet: string;
  milestoneName: string;
  milestoneDate: string;
  attachments: string[];
}

function initialFormState(project: Project | null): FormState {
  return {
    title: project?.name ?? '',
    externalCode: project?.externalCode ?? '',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    category: project?.category ?? 'CAPA',
    stage: 'Test Stage 1',
    priority: project?.priority ?? 'Medium',
    status: project?.status ?? 'Not Started',
    owner: project?.owner.name ?? '',
    assignees: '',
    researchNotes: '',
    developmentNotes: '',
    stageSet: '',
    milestoneName: '',
    milestoneDate: '',
    attachments: [],
  };
}

export default function EditProjectModal({ project, onClose }: EditProjectModalProps) {
  const [currentStep, setCurrentStep] = useState<StepIndex>(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState<FormState>(() => initialFormState(project));

  useEffect(() => {
    if (project) {
      setFormData(initialFormState(project));
      setCompletedSteps(new Set());
      setCurrentStep(0);
    }
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project, onClose]);

  const isOpen = project !== null;
  const isLast = currentStep === STEPS.length - 1;
  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setFormData((s) => ({ ...s, [key]: value }));

  const goToStep = (idx: StepIndex) => setCurrentStep(idx);

  const submit = () => {
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    if (isLast) {
      onClose();
    } else {
      setCurrentStep(((currentStep + 1) as StepIndex));
    }
  };

  const submitLabel = isLast ? 'Save Project' : 'Update Project Details';

  return (
    <>
      <div
        className={`rv-modal-backdrop${isOpen ? ' rv-modal-backdrop--open' : ''}`}
        onClick={onClose}
      />
      <aside
        className={`rv-edit-modal${isOpen ? ' rv-edit-modal--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rv-edit-modal-title"
      >
        <header className="rv-edit-modal-header">
          <h2 id="rv-edit-modal-title" className="rv-edit-modal-title">
            Edit Project
          </h2>
          <button
            type="button"
            className="rv-edit-modal-close"
            aria-label="Close"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </header>

        <div className="rv-edit-modal-body">
          <nav className="rv-edit-side-nav" aria-label="Edit project sections">
            {SIDE_ICONS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`rv-edit-side-btn${item.active ? ' rv-edit-side-btn--active' : ''}`}
              >
                <img src={item.src} alt={item.alt} className="rv-edit-side-btn-icon" />
              </button>
            ))}
          </nav>

          <div className="rv-edit-content">
            <Stepper
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={goToStep}
            />

            <form
              className="rv-edit-form"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              {currentStep === 0 && (
                <DetailsForm formData={formData} update={update} />
              )}
              {currentStep === 1 && (
                <RdForm formData={formData} update={update} />
              )}
              {currentStep === 2 && (
                <StageSetsForm formData={formData} update={update} />
              )}
              {currentStep === 3 && (
                <MilestonesForm formData={formData} update={update} />
              )}
              {currentStep === 4 && (
                <AttachmentsForm formData={formData} update={update} />
              )}
            </form>

            <button type="button" className="rv-edit-submit" onClick={submit}>
              {submitLabel}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function Stepper({
  currentStep,
  completedSteps,
  onStepClick,
}: {
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick: (idx: StepIndex) => void;
}) {
  return (
    <ol className="rv-edit-stepper">
      {STEPS.map((label, index) => {
        const isActive = index === currentStep;
        const isComplete = completedSteps.has(index);
        const classes = [
          'rv-edit-step',
          isActive && 'rv-edit-step--active',
          isComplete && 'rv-edit-step--complete',
        ]
          .filter(Boolean)
          .join(' ');
        return (
          <li key={label} className={classes}>
            <button
              type="button"
              className="rv-edit-step-btn"
              onClick={() => onStepClick(index as StepIndex)}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="rv-edit-step-dot">
                {isComplete && <CheckIcon className="rv-edit-step-check" fontSize="inherit" />}
              </span>
              <span className="rv-edit-step-label">{label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function DetailsForm({
  formData,
  update,
}: {
  formData: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  const priorityColor = PRIORITY_DOT[formData.priority] ?? '#9ca3af';
  const statusColor = STATUS_DOT[formData.status] ?? '#9ca3af';

  return (
    <>
      <Field label="Title">
        <input
          type="text"
          className="rv-edit-input"
          value={formData.title}
          onChange={(e) => update('title', e.target.value)}
        />
      </Field>

      <Field label="External Project Code">
        <input
          type="text"
          className="rv-edit-input"
          value={formData.externalCode}
          onChange={(e) => update('externalCode', e.target.value)}
        />
      </Field>

      <Field label="Description">
        <div className="rv-edit-textarea-wrap">
          <textarea
            className="rv-edit-textarea"
            rows={3}
            value={formData.description}
            onChange={(e) => update('description', e.target.value)}
          />
          <button
            type="button"
            className="rv-edit-textarea-toolbar"
            aria-label="Formatting"
          >
            <NotesIcon fontSize="small" />
          </button>
        </div>
      </Field>

      <div className="rv-edit-divider" />

      <Field label="Category" required>
        <SelectInput
          value={formData.category}
          onChange={(v) => update('category', v)}
          options={['CAPA', 'Engineering', 'Marketing', 'R&D']}
        />
      </Field>

      <Field label="Project Stage" required>
        <SelectInput
          value={formData.stage}
          onChange={(v) => update('stage', v)}
          options={['Test Stage 1', 'Test Stage 2', 'Production']}
        />
      </Field>

      <div className="rv-edit-grid-2">
        <Field label="Priority" required>
          <SelectInput
            value={formData.priority}
            onChange={(v) => update('priority', v)}
            options={['Critical', 'High', 'Medium', 'Low']}
            dotColor={priorityColor}
            dotColorMap={PRIORITY_DOT}
          />
        </Field>
        <Field label="Status" required>
          <SelectInput
            value={formData.status}
            onChange={(v) => update('status', v)}
            options={['Not Started', 'In Progress']}
            dotColor={statusColor}
            dotColorMap={STATUS_DOT}
          />
        </Field>
      </div>

      <Field label="Project Owner" required>
        <SelectInput
          value={formData.owner}
          onChange={(v) => update('owner', v)}
          options={['Alex T.', 'Sam R.', 'Kate M.', 'James D.', 'Ike Smith']}
        />
      </Field>

      <Field label="Project Assignees" required>
        <SelectInput
          value={formData.assignees}
          onChange={(v) => update('assignees', v)}
          options={['IY, RE', 'JT, MK, PL', 'DW, LH', 'NB']}
          placeholder="Select assignees"
        />
      </Field>
    </>
  );
}

function RdForm({
  formData,
  update,
}: {
  formData: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  return (
    <>
      <Field label="Research Notes">
        <textarea
          className="rv-edit-textarea"
          rows={4}
          value={formData.researchNotes}
          onChange={(e) => update('researchNotes', e.target.value)}
          placeholder="What problem are we exploring?"
        />
      </Field>
      <Field label="Development Notes">
        <textarea
          className="rv-edit-textarea"
          rows={4}
          value={formData.developmentNotes}
          onChange={(e) => update('developmentNotes', e.target.value)}
          placeholder="Implementation approach, risks, dependencies"
        />
      </Field>
    </>
  );
}

function StageSetsForm({
  formData,
  update,
}: {
  formData: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  return (
    <Field label="Stage Set" required>
      <SelectInput
        value={formData.stageSet}
        onChange={(v) => update('stageSet', v)}
        options={['CAPA', 'NPD', 'Standard']}
        placeholder="Select a stage set"
      />
    </Field>
  );
}

function MilestonesForm({
  formData,
  update,
}: {
  formData: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  return (
    <div className="rv-edit-grid-2">
      <Field label="Milestone Name" required>
        <input
          type="text"
          className="rv-edit-input"
          value={formData.milestoneName}
          onChange={(e) => update('milestoneName', e.target.value)}
          placeholder="e.g. Design Freeze"
        />
      </Field>
      <Field label="Target Date" required>
        <input
          type="date"
          className="rv-edit-input"
          value={formData.milestoneDate}
          onChange={(e) => update('milestoneDate', e.target.value)}
        />
      </Field>
    </div>
  );
}

function AttachmentsForm({
  formData,
  update,
}: {
  formData: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const names = Array.from(files).map((f) => f.name);
    update('attachments', [...formData.attachments, ...names]);
  };

  return (
    <Field label="Attachments">
      <label className="rv-edit-file-drop">
        <AttachFileIcon className="rv-edit-file-icon" />
        <span>Drop files or click to upload</span>
        <input
          type="file"
          multiple
          className="rv-edit-file-input"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
      {formData.attachments.length > 0 && (
        <ul className="rv-edit-file-list">
          {formData.attachments.map((name, i) => (
            <li key={`${name}-${i}`} className="rv-edit-file-item">
              {name}
            </li>
          ))}
        </ul>
      )}
    </Field>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="rv-edit-field">
      <span className="rv-edit-field-label">
        {label}
        {required && ' *'}
      </span>
      {children}
    </label>
  );
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  dotColor,
  dotColorMap,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  dotColor?: string;
  dotColorMap?: Record<string, string>;
}) {
  const selectId = useMemo(() => `rv-sel-${Math.random().toString(36).slice(2, 9)}`, []);
  const effectiveDotColor = dotColorMap && value ? dotColorMap[value] ?? dotColor : dotColor;

  return (
    <div className="rv-edit-select">
      {effectiveDotColor && (
        <span className="rv-edit-select-dot" style={{ background: effectiveDotColor }} />
      )}
      <select
        id={selectId}
        className="rv-edit-select-native"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {!value && placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ArrowDropDownIcon className="rv-edit-select-caret" />
    </div>
  );
}
