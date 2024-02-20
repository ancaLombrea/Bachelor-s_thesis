%% -c constant 
n_completeRequest = [1 10 50 100 200 500 1000 1500 2000 3000];
n_timeTaken = [0.004 0.024 0.101 0.223 0.235 0.381 0.692 0.99 1.398 2.014];
n_timePerRequest = [4.253 2.382 2.017 2.235 1.174 0.763 0.692 0.66 0.699 0.671];

subplot(2,1,1)
plot(n_completeRequest, n_timeTaken, "-*m")
title("Timpul de rulare a testelor în funcție de numărul de cereri [s]")
xlabel("Numărul de cereri")
ylabel("Timpul de rulare a testelor")

subplot(2,1,2)
plot(n_completeRequest, n_timePerRequest, "-*b")
title("Timpul mediu de prelucrare a unei cereri în funcție de numărul de cereri [ms]")
xlabel("Numărul de cereri")
ylabel("Timpul de prelucrare a unei cereri")

%% -n constant 
c_completeRequest = [1 10 20 30 40 50 100 200 300 400];
c_timeTaken = [0.666 0.502 0.508 0.524 0.485 0.589 0.497 0.502 0.939 1.378];
c_timePerRequest = [0.666 5.023 11.6 15.734 19.381 29.430 49.684 100.339 281.827 551.004];

subplot(2,1,1)
plot(c_completeRequest, c_timeTaken, "-*m")
title("Timpul de rulare a testelor în funcție de numărul de cereri [s]")
xlabel("Numărul de cereri")
ylabel("Timpul de rulare a testelor")

subplot(2,1,2)
plot(c_completeRequest, c_timePerRequest, "-*b")
title("Timpul mediu de prelucrare a unei cereri în funcție de numărul de cereri [ms]")
xlabel("Numărul de cereri")
ylabel("Timpul de prelucrare a unei cereri")