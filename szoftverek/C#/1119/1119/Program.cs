using System;
using System.Collections.Generic;
using System.Diagnostics;

class Program
{
	static void Main()
	{
		Init();
	}

	// ==== Globális adattároló típus ====
	public class SortResult
	{
		public int AdatokSzama { get; set; }
		public double Ido { get; set; }
		public string Modszer { get; set; }
	}

	// ==== Init függvény ====
	static void Init()
	{
		var sortMethods = new List<Action<int[], List<SortResult>>>
		{
			EcsSort,
			BuSort,
			GySort,
			BeSort,
			FkSort
		};

		var allDataArray = new List<SortResult>();
		var random = new Random();

		for (int i = 1; i < 10000; i *= 10)
		{
			var dataArray = new int[i * 10];

			for (int j = 0; j < dataArray.Length; j++)
			{
				dataArray[j] = random.Next(1, 1_000_001);
			}

			foreach (var method in sortMethods)
			{
				for (int f = 0; f < 5; f++)
				{
					method(dataArray, allDataArray);
				}
			}
		}

		Console.WriteLine("\n=== Összes mérési adat ===");
		foreach (var item in allDataArray)
		{
			Console.WriteLine($"{item.Modszer} | elemszám: {item.AdatokSzama} | idő: {item.Ido} ms");
		}
	}

	// ==== Adattároló függvény ====
	static void DataPushToArray(int arrayLength, double elapsedTime, string methodName, List<SortResult> allDataArray)
	{
		allDataArray.Add(new SortResult
		{
			AdatokSzama = arrayLength,
			Ido = elapsedTime,
			Modszer = methodName
		});
	}

	// ==== Egyszerű cserés rendezés ====
	static void EcsSort(int[] dataArray, List<SortResult> allDataArray)
	{
		var arr = (int[])dataArray.Clone();
		var sw = Stopwatch.StartNew();

		for (int i = 0; i < arr.Length - 1; i++)
		{
			for (int j = i + 1; j < arr.Length; j++)
			{
				if (arr[i] > arr[j])
				{
					(arr[i], arr[j]) = (arr[j], arr[i]);
				}
			}
		}

		sw.Stop();

		DataPushToArray(arr.Length, sw.Elapsed.TotalMilliseconds, "Egyszerű cserés rendezés", allDataArray);

		Console.WriteLine($"Egyszerű cserés rendezés: {arr.Length} elem | {sw.Elapsed.TotalMilliseconds} ms | első: {arr[0]}, utolsó: {arr[^1]}");
	}

	// ==== Buborékos rendezés ====
	static void BuSort(int[] dataArray, List<SortResult> allDataArray)
	{
		var arr = (int[])dataArray.Clone();
		var sw = Stopwatch.StartNew();

		for (int i = arr.Length - 1; i > 0; i--)
		{
			for (int j = 0; j < i; j++)
			{
				if (arr[j] > arr[j + 1])
				{
					(arr[j], arr[j + 1]) = (arr[j + 1], arr[j]);
				}
			}
		}

		sw.Stop();

		DataPushToArray(arr.Length, sw.Elapsed.TotalMilliseconds, "Buborékos rendezés", allDataArray);

		Console.WriteLine($"Buborékos rendezés: {arr.Length} elem | {sw.Elapsed.TotalMilliseconds} ms | első: {arr[0]}, utolsó: {arr[^1]}");
	}

	// ==== Gyorsrendezés (Quicksort) ====
	static void GySort(int[] dataArray, List<SortResult> allDataArray)
	{
		var arr = (int[])dataArray.Clone();
		var sw = Stopwatch.StartNew();

		QuickSort(arr, 0, arr.Length - 1);

		sw.Stop();

		DataPushToArray(arr.Length, sw.Elapsed.TotalMilliseconds, "Gyors rendezés", allDataArray);

		Console.WriteLine($"Gyors rendezés: {arr.Length} elem | {sw.Elapsed.TotalMilliseconds} ms | első: {arr[0]}, utolsó: {arr[^1]}");
	}

	static void QuickSort(int[] arr, int low, int high)
	{
		int i = low;
		int j = high;
		int pivot = arr[(low + high) / 2];

		while (i <= j)
		{
			while (arr[i] < pivot) i++;
			while (arr[j] > pivot) j--;

			if (i <= j)
			{
				(arr[i], arr[j]) = (arr[j], arr[i]);
				i++; j--;
			}
		}

		if (low < j) QuickSort(arr, low, j);
		if (i < high) QuickSort(arr, i, high);
	}

	// ==== Beszúrásos rendezés ====
	static void BeSort(int[] dataArray, List<SortResult> allDataArray)
	{
		var arr = (int[])dataArray.Clone();
		var sw = Stopwatch.StartNew();

		for (int i = 1; i < arr.Length; i++)
		{
			int helper = arr[i];
			int j = i - 1;

			while (j >= 0 && arr[j] > helper)
			{
				arr[j + 1] = arr[j];
				j--;
			}
			arr[j + 1] = helper;
		}

		sw.Stop();

		DataPushToArray(arr.Length, sw.Elapsed.TotalMilliseconds, "Beszúrásos rendezés", allDataArray);

		Console.WriteLine($"Beszúrásos rendezés: {arr.Length} elem | {sw.Elapsed.TotalMilliseconds} ms | első: {arr[0]}, utolsó: {arr[^1]}");
	}

    // ==== Fordított kiválasztásos rendezés ====
    static void FkSort(int[] dataArray, List<SortResult> allDataArray)
    {
        var arr = (int[])dataArray.Clone();
        var sw = Stopwatch.StartNew();

        int helper;
        for (int i = arr.Length - 1; i > 0; i--)
        {
            for (int j = i - 1; j >= 0; j--)
            {
                if (arr[i] < arr[j])
                {
                    helper = arr[i];
                    arr[i] = arr[j];
                    arr[j] = helper;
                }
            }
        }

        sw.Stop();

        DataPushToArray(arr.Length, sw.Elapsed.TotalMilliseconds, "Fordított kiválasztásos rendezés", allDataArray);

        Console.WriteLine($"Fordított kiválasztásos rendezés: {arr.Length} elem | {sw.Elapsed.TotalMilliseconds} ms | első: {arr[0]}, utolsó: {arr[^1]}");
    }

}
