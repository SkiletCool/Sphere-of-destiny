document.addEventListener("DOMContentLoaded", function () {
        const questionInput = document.getElementById("questionInput");
        const askBtn = document.getElementById("askBtn");
        const clearBtn = document.getElementById("clearBtn");
        const clearHistoryBtn = document.getElementById("clearHistoryBtn");
        const sphere = document.getElementById("sphere");
        const sphereContent = document.getElementById("sphereContent");
        const initialText = document.getElementById("initialText");
        const answerText = document.getElementById("answerText");
        const glow = document.getElementById("glow");
        const historyList = document.getElementById("historyList");

        let isThinking = false;

        // Очистка вопроса
        clearBtn.addEventListener("click", function () {
          questionInput.value = "";
          questionInput.focus();
        });

        // Очистка истории
        clearHistoryBtn.addEventListener("click", function () {
          historyList.innerHTML = "";

          // Анимация подтверждения очистки
          const originalText = clearHistoryBtn.innerHTML;
          clearHistoryBtn.innerHTML =
            '<i class="fas fa-check mr-1"></i> Готово!';
          clearHistoryBtn.classList.add("text-green-300");

          setTimeout(() => {
            clearHistoryBtn.innerHTML = originalText;
            clearHistoryBtn.classList.remove("text-green-300");
          }, 1500);
        });

        // Задать вопрос
        askBtn.addEventListener("click", function () {
          if (isThinking) return;

          const question = questionInput.value.trim();
          if (!question) {
            shakeSphere();
            return;
          }

          startThinking(question);
        });

        // Анимация тряски сферы
        function shakeSphere() {
          sphere.classList.add("shake");
          setTimeout(() => {
            sphere.classList.remove("shake");
          }, 500);
        }

        // Процесс "размышления"
        function startThinking(question) {
          isThinking = true;
          initialText.textContent = "Думаю...";
          sphere.classList.add("thinking");
          askBtn.disabled = true;

          // Случайное время "размышления" от 2 до 4 секунд
          const thinkTime = 2000 + Math.random() * 2000;

          setTimeout(() => {
            generateAnswer(question);
          }, thinkTime);
        }

        // Генерация ответа
        function generateAnswer(question) {
          isThinking = false;
          sphere.classList.remove("thinking");
          askBtn.disabled = false;

          const answers = [
            { text: "Да 🟢", color: "text-green-400" },
            { text: "Нет 🔴", color: "text-red-400" },
            { text: "Возможно 🟡", color: "text-yellow-400" },
            { text: "Скорее да 🟢", color: "text-green-400" },
            { text: "Скорее нет 🔴", color: "text-red-400" },
            { text: "Не сейчас 🟡", color: "text-yellow-400" },
            { text: "Бесспорно 🟢", color: "text-green-400" },
            { text: "Ни в коем случае 🔴", color: "text-red-400" },
            { text: "Время покажет 🟡", color: "text-yellow-400" },
          ];

          const randomAnswer =
            answers[Math.floor(Math.random() * answers.length)];

          initialText.classList.add("hidden");
          answerText.classList.remove("hidden");
          answerText.textContent = randomAnswer.text;
          answerText.className = `text-2xl font-bold answer-text ${randomAnswer.color}`;

          // Анимация свечения
          glow.className = `absolute inset-0 rounded-full opacity-70 blur-xl ${randomAnswer.color.replace(
            "text-",
            "bg-"
          )} pointer-events-none transition-opacity duration-300`;
          setTimeout(() => {
            glow.classList.add("opacity-0");
          }, 1000);

          // Добавление в историю
          addToHistory(question, randomAnswer.text, randomAnswer.color);
        }

        // Добавление вопроса и ответа в историю
        function addToHistory(question, answer, colorClass) {
          const now = new Date();
          const timeString = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          const historyItem = document.createElement("div");
          historyItem.className =
            "bg-white/5 rounded-lg p-3 border border-white/10";
          historyItem.innerHTML = `
                    <div class="text-sm text-purple-200 mb-1">${timeString}</div>
                    <div class="font-medium mb-1">${question}</div>
                    <div class="${colorClass} font-bold">${answer}</div>
                `;

          historyList.insertBefore(historyItem, historyList.firstChild);

          // Ограничение истории 10 последними записями
          if (historyList.children.length > 10) {
            historyList.removeChild(historyList.lastChild);
          }
        }

        // Обработка нажатия Enter в текстовом поле
        questionInput.addEventListener("keydown", function (e) {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            askBtn.click();
          }
        });
      });