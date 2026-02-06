document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Hover Interaction
    const cards = document.querySelectorAll('.flow-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Remove active class from all
            cards.forEach(c => c.classList.remove('active'));
            // Add active to this
            card.classList.add('active');

            // Optional: Highlight related node in diagram if we want deeper interaction
            // For now, card highlight is enough as per Plan
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('active');
        });
    });
});
