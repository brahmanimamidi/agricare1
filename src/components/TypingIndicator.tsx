const TypingIndicator = () => (
  <div className="flex items-center gap-2 pl-10">
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: '#c8a84b',
            animation: 'bounce-dot 1.4s infinite ease-in-out both',
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </div>
  </div>
);

export default TypingIndicator;
