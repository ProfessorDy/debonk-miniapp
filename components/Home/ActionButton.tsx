interface ActionButtonsProps {
  buttons: { label: string; icon: JSX.Element; action: () => void }[];
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ buttons }) => (
  <div className="flex w-3/5 mx-auto justify-between mt-4 text-[10px] text-accent font-light">
    {buttons.map((button, index) => (
      <button
        key={index}
        className="flex flex-col items-center gap-[3px] p-2 rounded-lg shadow border border-accent w-[60px]"
        onClick={button.action}
      >
        {button.icon}
        {button.label}
      </button>
    ))}
  </div>
);

export default ActionButtons;
