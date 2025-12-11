using System;
using System.Collections.Generic;
using System.Diagnostics;

class Program
{
    static void Main()
    {
        Init();
    }

    public class SortResult
    {
        public int AdatokSzama { get; set; } 
        public double Ido { get; set; }
        public string Modszer { get; set; }
    }

    static void Init()
    {
        var sortMethods = new List<Action<List<int>, List<SortResult>>>
        {
            EcsSort
            //GySort
        };

        var allDataArray = new List<SortResult>();
        var random = new Random();

        for (int i = 1; i < 100000; i *= 10)
        {
            var dataList = new List<int>(i * 10);

            for (int j = 0; j < i * 10; j++)
            {
                dataList.Add(random.Next(1, 1_000_001));
            }

            foreach (var method in sortMethods)
            {
                for (int f = 0; f < 5; f++)
                {
                    method(dataList, allDataArray);
                }
            }
        }

        Console.WriteLine("\n=== Összes mérési adat ===");
        foreach (var item in allDataArray)
        {
            Console.WriteLine($"{item.Modszer} | elemszám: {item.AdatokSzama} | idő: {item.Ido} ms");
        }
    }

    static void DataPushToArray(int arrayLength, double elapsedTime, string methodName, List<SortResult> allDataArray)
    {
        allDataArray.Add(new SortResult
        {
            AdatokSzama = arrayLength,
            Ido = elapsedTime,
            Modszer = methodName
        });
    }

    static void EcsSort(List<int> dataList, List<SortResult> allDataArray)
    {
        var arr = new List<int>(dataList);
        var sw = Stopwatch.StartNew();

        for (int i = 0; i < arr.Count - 1; i++)
        {
            for (int j = i + 1; j < arr.Count; j++)
            {
                if (arr[i] > arr[j])
                {
                    (arr[i], arr[j]) = (arr[j], arr[i]);
                }
            }
        }

        sw.Stop();

        DataPushToArray(arr.Count, sw.Elapsed.TotalMilliseconds, "Egyszerű cserés rendezés", allDataArray);
        Console.WriteLine($"Egyszerű cserés rendezés: {arr.Count} elem | {sw.Elapsed.TotalMilliseconds} ms | első: {arr[0]}, utolsó: {arr[^1]}");
    }

    static void GySort(List<int> dataList, List<SortResult> allDataArray)
    {
        var arr = new List<int>(dataList);
        var sw = Stopwatch.StartNew();

        QuickSort(arr, 0, arr.Count - 1);

        sw.Stop();

        DataPushToArray(arr.Count, sw.Elapsed.TotalMilliseconds, "Gyors rendezés", allDataArray);
        Console.WriteLine($"Gyors rendezés: {arr.Count} elem | {sw.Elapsed.TotalMilliseconds} ms | első: {arr[0]}, utolsó: {arr[^1]}");
    }

    static void QuickSort(List<int> arr, int low, int high)
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
}
