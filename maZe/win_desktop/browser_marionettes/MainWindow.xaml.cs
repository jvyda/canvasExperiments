using System;
using System.Collections.Generic;
using System.Text;
using System.Windows;
using System.Windows.Forms;
using System.Configuration;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Diagnostics.CodeAnalysis;
using System.Security;
using System.Drawing;
using System.IO;

namespace maZe_frontend
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {

        private String browserPath;
        private String browserName;
        private KeyValueConfigurationCollection confCollection;
        private Configuration configManager;

        public MainWindow()
        {
            string[] args = Environment.GetCommandLineArgs();
            Console.WriteLine(args[0]);
            if (args.Length > 1 && args[1].Equals("/S"))
            {
                startInChrome();
                Environment.Exit(0);
            }
            InitializeComponent();
            configManager = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);
            confCollection = configManager.AppSettings.Settings;
            browserPath = confCollection["browserPath"].Value;
            browserName = confCollection["browserName"].Value;
            // equals returned false.. contains worked
            chromeRadio.IsChecked = browserName.Contains("chrome");
            firefoxRadio.IsChecked = !browserName.Contains("chrome");
            pathTextBox.Text = browserPath;
        }



        private void onClose(object sender, RoutedEventArgs e)
        {
            save();
            exit();
        }

        private void exit()
        {
            Environment.Exit(0);
        }

        private void save()
        {
            confCollection["browserPath"].Value = browserPath;
            // really?
            confCollection["browserName"].Value = (chromeRadio.IsChecked == true) ? "chrome " : "firefox";


            configManager.Save(ConfigurationSaveMode.Modified);
            ConfigurationManager.RefreshSection(configManager.AppSettings.SectionInformation.Name);
        }


        private void onOpenFileChooser(object sender, RoutedEventArgs e)
        {
            Microsoft.Win32.OpenFileDialog dlg = new Microsoft.Win32.OpenFileDialog();
            dlg.FileName = "";
            dlg.DefaultExt = ".exe";
            dlg.Filter = "Executables (.exe)|*.exe";

            Nullable<bool> result = dlg.ShowDialog();

            if (result == true) {
                browserPath = dlg.FileName;
            }
            pathTextBox.Text = browserPath;
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            createFireFoxProfiles();
            startInFirefox();
        }

        private void createFireFoxProfiles()
        {

            int screenAmount = Screen.AllScreens.Length;
            string wd = Directory.GetCurrentDirectory();
            for (int i = 0; i < screenAmount; i++)
            {
                string profileName = "maZe" + i;
                if(Directory.Exists(Path.Combine(wd, profileName))) {
                    Console.WriteLine(profileName + " profile exists");
                    continue;
                }
                Process browser = new Process();
                browser.StartInfo.WindowStyle = ProcessWindowStyle.Normal;

                browser.StartInfo.FileName = browserPath;
                browser.StartInfo.Arguments = " -CreateProfile \"" + profileName + " " + wd + "\\" + profileName + "\"";
                Console.WriteLine(browser.StartInfo.Arguments);
                browser.Start();
                browser.WaitForInputIdle();
            }
        }

        private void startInFirefox()
        {
            int screenAmount = Screen.AllScreens.Length;
            for (int i = 0; i < screenAmount; i++)
            {
                string profileName = "maZe" + i;
                Process browser = new Process();
                browser.StartInfo.WindowStyle = ProcessWindowStyle.Normal;

                browser.StartInfo.FileName = browserPath;
                browser.StartInfo.Arguments = " -no-remote -p \"" + profileName + "\" " + confCollection["browserUrl"].Value;
                browser.Start();
                browser.WaitForInputIdle();
            }

            System.Threading.Thread.Sleep(30000);
            Console.WriteLine("yes");

            Process[] fireFoxprocs = Process.GetProcessesByName("firefox");
            List<Process> mazeInstances = new List<Process>();
            foreach (Process proc in fireFoxprocs) {
                Console.WriteLine(proc.MainWindowTitle);
                if (proc.MainWindowTitle.Contains("maZe")) {
                    mazeInstances.Add(proc);
                }
            }
            for (int i = 0; i < screenAmount; i++) {
                Console.Write("moving window to correct screen");
                Rectangle monitor = Screen.AllScreens[i].WorkingArea;
                SetWindowPos(mazeInstances[i].MainWindowHandle, 0,
                monitor.Left, monitor.Top, monitor.Width,
                monitor.Height, 0);
                SetForegroundWindow(mazeInstances[i].MainWindowHandle);
                SendKeys.SendWait("{ENTER}");
                SendKeys.SendWait("{F11}");
            }

        }

        private void checkProcesses(List<Process> mazeInstances) {
            bool running = true;
            while (running) {
                foreach (Process proc in mazeInstances) {
                    proc.Refresh();
                    if (proc.HasExited) {
                        running = false;
                    }
                }
                System.Threading.Thread.Sleep(300);
            }
            Environment.Exit(0);
        }

        private void startInChrome()
        {
            string strCmdText;
            strCmdText = " --new-window " + confCollection["browserUrl"].Value;
            int screenAmount = Screen.AllScreens.Length;
            for (int i = 0; i < screenAmount; i++)
            {
                Process browser = new Process();
                browser.StartInfo.WindowStyle = ProcessWindowStyle.Normal;

                browser.StartInfo.FileName = browserPath;
                browser.StartInfo.Arguments = strCmdText;
                Console.WriteLine(browser.StartInfo.Arguments);
                browser.Start();
                browser.WaitForInputIdle();
            }

            System.Threading.Thread.Sleep(10000);

            IEnumerable<IntPtr> procs = ChromeWindowTitles();
            IEnumerator<IntPtr> num =  procs.GetEnumerator();

            for (int i = 0; i < screenAmount; i++)
            {
                Rectangle monitor = Screen.AllScreens[i].WorkingArea;
                Console.WriteLine();
                SetWindowPos(num.Current, 0,
                monitor.Left, monitor.Top, monitor.Width,
                monitor.Height, 0);
                num.MoveNext();
                SendKeys.SendWait("F11");
            }
        }

        [DllImport("user32")]
        public static extern long SetWindowPos(IntPtr hwnd, int hWndInsertAfter, int X, int y, int cx, int cy, int wFlagslong);

        [DllImport("user32.dll")]
        private static extern bool SetForegroundWindow(IntPtr hWnd);



        public IEnumerable<IntPtr> ChromeWindowTitles()
        {
            foreach (var title in WindowsByClassFinder.WindowTitlesForClass("Chrome_WidgetWin_0"))
                if (!string.IsNullOrWhiteSpace(title.name))
                    yield return title.reference;

            foreach (var title in WindowsByClassFinder.WindowTitlesForClass("Chrome_WidgetWin_1"))
                if (!string.IsNullOrWhiteSpace(title.name))
                    yield return title.reference;
        }




    }

    // https://stackoverflow.com/questions/16958051/get-chrome-browser-title-using-c-sharp/16958798#16958798

    class WindowsByClassFinder
    {
        public delegate bool EnumWindowsDelegate(IntPtr hWnd, IntPtr lparam);

        [SuppressMessage("Microsoft.Security", "CA2118:ReviewSuppressUnmanagedCodeSecurityUsage"), SuppressUnmanagedCodeSecurity]
        [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
        public static extern int GetClassName(IntPtr hWnd, StringBuilder lpClassName, int nMaxCount);

        [SuppressMessage("Microsoft.Security", "CA2118:ReviewSuppressUnmanagedCodeSecurityUsage"), SuppressUnmanagedCodeSecurity]
        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        public extern static bool EnumWindows(EnumWindowsDelegate lpEnumFunc, IntPtr lparam);

        [SuppressMessage("Microsoft.Security", "CA2118:ReviewSuppressUnmanagedCodeSecurityUsage"), SuppressUnmanagedCodeSecurity]
        [DllImport("User32", CharSet = CharSet.Auto, SetLastError = true)]
        public static extern int GetWindowText(IntPtr windowHandle, StringBuilder stringBuilder, int nMaxCount);

        [DllImport("user32.dll", EntryPoint = "GetWindowTextLength", SetLastError = true)]
        internal static extern int GetWindowTextLength(IntPtr hwnd);


        /// <summary>Find the windows matching the specified class name.</summary>

        public static IEnumerable<IntPtr> WindowsMatching(string className)
        {
            return new WindowsByClassFinder(className)._result;
        }

        private WindowsByClassFinder(string className)
        {
            _className = className;
            EnumWindows(callback, IntPtr.Zero);
        }

        private bool callback(IntPtr hWnd, IntPtr lparam)
        {
            if (GetClassName(hWnd, _apiResult, _apiResult.Capacity) != 0)
            {
                if (string.CompareOrdinal(_apiResult.ToString(), _className) == 0)
                {
                    _result.Add(hWnd);
                }
            }

            return true; // Keep enumerating.
        }

        public static IEnumerable<MazeWindow> WindowTitlesForClass(string className)
        {
            foreach (var windowHandle in WindowsMatchingClassName(className))
            {
                int length = GetWindowTextLength(windowHandle);
                StringBuilder sb = new StringBuilder(length + 1);
                GetWindowText(windowHandle, sb, sb.Capacity);
                yield return new MazeWindow(sb.ToString(), windowHandle);
            }
        }

        public static IEnumerable<IntPtr> WindowsMatchingClassName(string className)
        {
            if (string.IsNullOrWhiteSpace(className))
                throw new ArgumentOutOfRangeException("className", className, "className can't be null or blank.");

            return WindowsMatching(className);
        }

        private readonly string _className;
        private readonly List<IntPtr> _result = new List<IntPtr>();
        private readonly StringBuilder _apiResult = new StringBuilder(1024);
    }

    static class DemoUtil
    {
        public static void Print(this object self)
        {
            Console.WriteLine(self);
        }

        public static void Print(this string self)
        {
            Console.WriteLine(self);
        }

        public static void Print<T>(this IEnumerable<T> self)
        {
            foreach (var item in self)
                Console.WriteLine(item);
        }
    }


    class MazeWindow
    {
        public string name;
        public IntPtr reference;

        public MazeWindow(string name, IntPtr intp)
        {
            this.name = name;
            this.reference = intp;
        }
    }




}
